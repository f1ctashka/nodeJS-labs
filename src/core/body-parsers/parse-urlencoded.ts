export function parseUrlencoded(rawBody: string) {
  return Object.fromEntries(new URLSearchParams(rawBody));
}
