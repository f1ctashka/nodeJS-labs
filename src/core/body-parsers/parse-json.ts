import { HttpException } from '../http-exception';
import HttpStatus from 'http-status';

export function parseJson<
  TBody extends Record<string, unknown> = Record<string, unknown>
>(rawBody: string): TBody {
  try {
    return JSON.parse(rawBody);
  } catch {
    throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid JSON body');
  }
}
