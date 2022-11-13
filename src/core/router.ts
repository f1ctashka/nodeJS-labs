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
}
