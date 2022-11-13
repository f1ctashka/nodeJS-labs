import { IncomingMessage } from 'node:http';
import { Buffer } from 'node:buffer';
import { HttpMethod } from './enums/http-method.enum';
import { ContentType } from './enums/content-type.enum';
import { normalizePath } from './utils/normalize-path.util';
import { HttpException } from './http-exception';
import HttpStatus from 'http-status';
import { parseBody } from './body-parsers/parse-body.util';

export class RequestInfo {
  public url?: URL;
  public method?: HttpMethod;
  public contentType?: ContentType;
  public body?: string | Record<string, unknown>;
  public path?: string;
  public query?: Record<string, string>;

  private constructor(private readonly request: IncomingMessage) {}

  public static async process(request: IncomingMessage): Promise<RequestInfo> {
    const instance = new RequestInfo(request);

    const { method, contentType } = instance.validateHead();
    instance.method = method;
    instance.contentType = contentType;
    instance.url = instance.parseUrl();
    instance.path = normalizePath(instance.url?.pathname || '');
    instance.query = Object.fromEntries(
      instance.url?.searchParams?.entries() || []
    );
    instance.body = await instance.parseBody();

    return instance;
  }

  private validateHead() {
    const { method, headers } = this.request;
    const contentType = headers['content-type']?.split(';').shift();

    this.validateMethod(method);
    this.validateContentType(contentType);

    return { method, contentType } as {
      method: HttpMethod;
      contentType: ContentType;
    };
  }

  private validateMethod(method?: string): method is HttpMethod {
    if (!method)
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Request method undefined'
      );
    if (!Object.values(HttpMethod).includes(method as HttpMethod)) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        `Unsupported request method. Valid methods: ${Object.values(
          HttpMethod
        ).join(', ')}`
      );
    }

    return true;
  }

  private validateContentType(
    contentType?: string
  ): contentType is ContentType {
    if (!contentType) return false;

    if (!Object.values(ContentType).includes(contentType as ContentType)) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Unsupported content type'
      );
    }

    return true;
  }

  private parseUrl(): URL {
    const { host } = this.request.headers;
    if (!host)
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid request host');

    return new URL(this.request.url || '/', `http://${host}/`);
  }

  private parseBody(): Promise<string | Record<string, unknown>> {
    if (!this.contentType) return Promise.resolve('');

    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];

      this.request.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk);
      });

      this.request.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf-8');
        const { contentType } = this;
        if (!contentType) {
          return reject(
            new HttpException(
              HttpStatus.BAD_REQUEST,
              'Unsupported content type'
            )
          );
        }

        parseBody(contentType, body).then(resolve).catch(reject);
      });

      this.request.on('error', reject);
    });
  }
}
