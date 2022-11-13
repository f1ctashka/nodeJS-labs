export interface RequestData<
  TParams extends Record<string, unknown> | unknown = Record<string, unknown>,
  TBody = unknown
> {
  body: TBody;
  params: TParams;
}
