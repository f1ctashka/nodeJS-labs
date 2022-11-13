function addLeadingSlash(path?: string): string {
  if (!path) return '/';
  if (!path.startsWith('/')) return `/${path}`;

  return path;
}

function removeEndSlash(path?: string): string {
  if (!path) return '/';
  if (path.endsWith('/')) return path.slice(0, path.length - 1);

  return path;
}

export function normalizePath(path?: string): string {
  if (!path) return '/';

  path = path.replace(/\/+/g, '/');
  path = addLeadingSlash(removeEndSlash(path));

  return path;
}
