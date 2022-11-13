import { HttpAdapter } from './http.adapter';

export class App {
  private readonly http = new HttpAdapter();

  public listen = this.http.listen.bind(this.http);
  public close = this.http.close.bind(this.http);

  constructor() {
    this.http.setRequestsHandler((request, response) => {
      response.writeHead(200).end('Hello');
    });
  }
}
