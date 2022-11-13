import { HttpMethod } from './enums/http-method.enum';
import { getClassMethodNames } from './utils/get-class-method-names.util';
import {
  CONTROLLER_PREFIX_METADATA,
  IS_CONTROLLER_METADATA,
  IS_ROUTE_METADATA,
  ROUTE_METHOD_METADATA,
  ROUTE_PATH_METADATA,
} from './constants';
import { normalizePath } from './utils/normalize-path.util';
import { IncomingMessage, ServerResponse } from 'node:http';
import { RequestInfo } from './request-info';
import { RequestData } from './interfaces/request-data.interface';
import { ContentType } from './enums/content-type.enum';
import { HttpException } from './http-exception';
import HttpStatus from 'http-status';
import { mapResponse } from './utils/map-response.util';
import { PathPattern } from './path-pattern';

interface Route {
  pattern: RegExp;
  method: HttpMethod;
  handler: {
    controller: object;
    method: string;
  };
}

export class Router {
  private readonly routes: Route[] = [];

  public registerController(controller: new () => object): this {
    const isController = Reflect.getMetadata(
      IS_CONTROLLER_METADATA,
      controller
    );
    if (!isController) {
      throw new Error(
        `${controller.name} is not a controller (Use @Controller() decorator to mark it as one)`
      );
    }

    this.registerControllerRoutes(controller);

    return this;
  }

  public registerControllers(controllers: (new () => object)[]): this {
    for (const controller of controllers) {
      this.registerController(controller);
    }

    return this;
  }

  private registerControllerRoutes(controller: new () => object) {
    const instance = new controller();
    const methods = Array.from(getClassMethodNames(instance));

    for (const method of methods) {
      const isRoute = Reflect.getMetadata(
        IS_ROUTE_METADATA,
        instance[method as keyof typeof instance]
      );
      if (!isRoute) continue;

      const controllerPrefix: string = Reflect.getMetadata(
        CONTROLLER_PREFIX_METADATA,
        controller
      );
      const path: string = Reflect.getMetadata(
        ROUTE_PATH_METADATA,
        instance[method as keyof typeof instance]
      );
      const httpMethod: HttpMethod = Reflect.getMetadata(
        ROUTE_METHOD_METADATA,
        instance[method as keyof typeof instance]
      );

      const routePath = normalizePath([controllerPrefix, path].join('/'));

      console.log(`Register ${httpMethod} ${routePath}`);

      this.routes.push({
        pattern: PathPattern.parse(routePath),
        method: httpMethod,
        handler: {
          controller: instance,
          method,
        },
      });
    }
  }

  public async handleRequest(
    request: IncomingMessage,
    response: ServerResponse
  ): Promise<void> {
    try {
      const { path = '/', method, body } = await RequestInfo.process(request);

      for (const route of this.routes) {
        if (method !== route.method) continue;
        const { matches, params } = PathPattern.check(path, route.pattern);
        if (!matches) continue;

        const requestData: RequestData = {
          params,
          body,
        };

        const { controller, method: controllerMethod } = route.handler;

        const responseBody = await (
          controller[controllerMethod as keyof typeof controller] as (
            requestData: RequestData
          ) =>
            | void
            | string
            | Record<string, unknown>
            | Promise<void>
            | Promise<string>
            | Promise<Record<string, unknown>>
        )(requestData);

        const { responseText, headers } = this.formResponse(responseBody);

        response.writeHead(
          method === HttpMethod.Post ? HttpStatus.CREATED : HttpStatus.OK,
          headers
        );
        if (responseText) return void response.end(responseText);

        return void response.end();
      }

      this.handleNotFound(response);
    } catch (error) {
      this.handleError(error, response);
    }
  }

  private sendError(exception: HttpException, response: ServerResponse) {
    response
      .writeHead(exception.statusCode, {
        'content-type': ContentType.PlainText,
      })
      .end(exception.message);
  }

  private formResponse(
    responseBody: string | number | void | Record<string, unknown>
  ): {
    headers: Record<string, string>;
    responseText?: string;
  } {
    const headers: Record<string, string> = {};
    const [contentType, responseText] = mapResponse(responseBody);
    if (contentType) headers['content-type'] = contentType;

    return { headers, responseText };
  }

  private handleNotFound(response: ServerResponse) {
    return this.sendError(
      new HttpException(HttpStatus.NOT_FOUND, 'Not Found'),
      response
    );
  }

  private handleError(error: unknown, response: ServerResponse) {
    if (!(error instanceof HttpException)) {
      return this.sendError(
        new HttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error'
        ),
        response
      );
    } else {
      return this.sendError(error, response);
    }
  }
}
