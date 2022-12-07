export const isNull = (value: unknown): value is null | undefined =>
  typeof value === 'undefined' || value === null;

export const isFunction = (
  value: unknown
): value is (...args: unknown[]) => unknown => typeof value === 'function';

export const isMethod = (prototype: object, property: string) => {
  const descriptor = Object.getOwnPropertyDescriptor(prototype, property);
  if (descriptor?.set || descriptor?.get) {
    return false;
  }

  return (
    property !== 'constructor' &&
    isFunction(prototype[property as keyof typeof prototype])
  );
};
