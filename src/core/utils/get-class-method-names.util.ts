import { isMethod, isNull } from './is.util';

export function* getClassMethodNames(
  prototype: object | null
): IterableIterator<string> {
  do {
    yield* Object.getOwnPropertyNames(prototype).filter(
      (property) => prototype && isMethod(prototype, property)
    );
  } while (
    !isNull(prototype) &&
    (prototype = Reflect.getPrototypeOf(prototype)) &&
    prototype !== Object.prototype
  );
}
