import { HttpMethod } from '../enums/http-method.enum';
import {
  IS_ROUTE_METADATA,
  ROUTE_METHOD_METADATA,
  ROUTE_PATH_METADATA,
} from '../constants';

export interface RouteMetadata {
  [ROUTE_PATH_METADATA]?: string;
  [ROUTE_METHOD_METADATA]?: HttpMethod;
}

const defaultRouteMetadata: RouteMetadata = {
  [ROUTE_METHOD_METADATA]: HttpMethod.Get,
  [ROUTE_PATH_METADATA]: '/',
};

export function Route(
  metadata: RouteMetadata = defaultRouteMetadata
): MethodDecorator {
  const pathMetadata = metadata[ROUTE_PATH_METADATA];
  const path = pathMetadata?.length
    ? pathMetadata
    : defaultRouteMetadata[ROUTE_PATH_METADATA];
  const method =
    metadata[ROUTE_METHOD_METADATA] ||
    defaultRouteMetadata[ROUTE_METHOD_METADATA];

  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(IS_ROUTE_METADATA, true, descriptor.value);
    Reflect.defineMetadata(ROUTE_PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(ROUTE_METHOD_METADATA, method, descriptor.value);

    return descriptor;
  };
}

const createRouteDecorator = (method: HttpMethod) => {
  return (path?: string): MethodDecorator => {
    return Route({
      [ROUTE_METHOD_METADATA]: method,
      [ROUTE_PATH_METADATA]: path,
    });
  };
};

export const Get = createRouteDecorator(HttpMethod.Get);

export const Post = createRouteDecorator(HttpMethod.Post);

export const Put = createRouteDecorator(HttpMethod.Put);
