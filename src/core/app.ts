import { HttpAdapter } from './http.adapter';
import { Router } from './router';

export class App {
  private readonly http = new HttpAdapter();
  private readonly router = new Router();
  public registerController = this.router.registerController.bind(this.router);
  public registerControllers = this.router.registerControllers.bind(
    this.router
  );

  public listen = this.http.listen.bind(this.http);
  public close = this.http.close.bind(this.http);

  constructor() {
    this.http.setRequestsHandler((request, response) => {
      response.writeHead(200).end('Hello');
    });
  }
}
