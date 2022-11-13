import { normalizePath } from './utils/normalize-path.util';

export class PathPattern {
  public static parse(path: string): RegExp {
    let pattern = '^';
    path = normalizePath(path);
    path = path.replace(/\*+/, '*');
    path = path.replace(/\?+/, '?');

    const pathSlices = path.split('/');
    // If the path begins with / (.split -> ['', 'users'])
    if (pathSlices[0] === '') pathSlices.shift();

    for (const [index, slice] of pathSlices.entries()) {
      const isOptional = slice.endsWith('?');
      const isLast = index === pathSlices.length - 1;

      if (isOptional && !isLast) {
        throw new Error(
          'An optional parameter should be at the end of the pattern'
        );
      }

      if (slice === '*') {
        // Wildcard
        if (!isLast)
          throw new Error('The wildcard should be at the end of the pattern');

        pattern += '/(?<wildcard>.*)';
      } else if (slice.startsWith(':')) {
        // Parameter
        // Slice end: if ends with '?' -> isOptional == 1
        const paramName = slice.slice(1, slice.length - Number(isOptional));

        pattern += isOptional
          ? `(?:/(?<${paramName}>[^/]+?))?`
          : `/(?<${paramName}>[^/]+?)`;
      } else {
        pattern += `/${slice}`;
      }
    }

    pattern += '$';

    return new RegExp(pattern, 'i');
  }

  public static check(
    path: string,
    pattern: RegExp
  ): { matches: boolean; params: Record<string, unknown> } {
    if (!pattern.test(path)) return { matches: false, params: {} };

    return {
      matches: true,
      params: pattern.exec(path)?.groups || {},
    };
  }
}
