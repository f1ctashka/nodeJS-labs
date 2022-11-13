export function parseJson<
  TBody extends Record<string, unknown> = Record<string, unknown>
>(rawBody: string): TBody {
  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error('Invalid JSON body');
  }
}
