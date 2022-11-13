import {
  createServer,
  IncomingMessage,
  Server,
  ServerResponse,
} from 'node:http';

interface RequestsHandler {
  (request: IncomingMessage, response: ServerResponse): void | Promise<void>;
}

export class HttpAdapter {
  private readonly httpServer: Server = createServer();
  private requestsHandler?: RequestsHandler;

  constructor() {
    this.setupErrorListeners();
  }

  public setRequestsHandler(handler: RequestsHandler) {
    if (this.requestsHandler) {
      this.httpServer.off('request', this.requestsHandler);
    }

    this.requestsHandler = handler.bind(this);
    this.httpServer.on('request', this.requestsHandler);
  }

  public async listen(port: string | number, hostname?: string): Promise<void> {
    return new Promise((resolve) => {
      if (hostname) this.httpServer.listen(+port, hostname, resolve);
      else this.httpServer.listen(+port, resolve);
    });
  }

  public async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServer.close((error) => {
        if (error) reject(error);
        resolve();
      });
    });
  }

  private setupErrorListeners() {
    this.httpServer.on(
      'clientError',
      (error: NodeJS.ErrnoException, socket) => {
        if (error.code === 'ECONNRESET' || !socket.writable) {
          return;
        }

        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      }
    );

    this.httpServer.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error('Error: address in use');
      }

      if (error.code === 'EACCES') {
        console.error('Error: port in use, please try another one');
      }

      this.close()
        .then(() => {
          process.exit(1);
        })
        .catch(() => {
          console.error('Error: cannot close the server');
          process.exit(1);
        });
    });
  }
}
