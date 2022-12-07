import { ContentType } from '../enums/content-type.enum';

export function mapResponse(
  response: string | number | void | null | undefined | Record<string, unknown>
): [ContentType | undefined, string | undefined] {
  switch (typeof response) {
    case 'object':
      return [ContentType.JSON, JSON.stringify(response, null, 2)];
    case 'string':
      return [ContentType.PlainText, response];
    case 'number':
      return [ContentType.PlainText, response.toString()];
    case 'undefined':
      return [undefined, undefined];
    default:
      throw new Error('Unsupported response body type');
  }
}
