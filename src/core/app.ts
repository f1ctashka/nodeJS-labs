import { HttpAdapter } from './http.adapter';
import { Router } from './router';

export class App {
  private readonly http = new HttpAdapter();
  private readonly router = new Router();

  public listen = this.http.listen.bind(this.http);
  public close = this.http.close.bind(this.http);
  public registerController = this.router.registerController.bind(this.router);
  public registerControllers = this.router.registerControllers.bind(
    this.router
  );

  constructor() {
    this.http.setRequestsHandler(this.router.handleRequest.bind(this.router));
  }
}
