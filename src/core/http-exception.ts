export class HttpException extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message || 'Internal Server Error');
  }
}
