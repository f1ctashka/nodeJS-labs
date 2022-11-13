import { ContentType } from '../enums/content-type.enum';
import { parseJson } from './parse-json';
import { parsePlainText } from './parse-plain-text';
import { parseUrlencoded } from './parse-urlencoded';

type ParserFn = (
  rawBody: string
) =>
  | string
  | Record<string, unknown>
  | Promise<string | Record<string, unknown>>;

const parsersMap: Record<ContentType, ParserFn> = {
  [ContentType.JSON]: parseJson,
  [ContentType.PlainText]: parsePlainText,
  [ContentType.Urlencoded]: parseUrlencoded,
};

export async function parseBody(
  contentType: ContentType,
  rawBody: string
): Promise<ReturnType<typeof parsersMap[typeof contentType]>> {
  const parser = parsersMap[contentType];

  if (!parser) throw new Error('Parser not found for ' + contentType);

  return parser(rawBody);
}
