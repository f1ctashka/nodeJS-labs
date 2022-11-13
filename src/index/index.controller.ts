import { Controller } from '../core/decorators/controller.decorator';
import { Get } from '../core/decorators/route.decorator';

@Controller()
export class IndexController {
  @Get()
  public index() {
    return 'hello!';
  }

  @Get('json')
  public getJson() {
    return {
      hello: 'world',
    };
  }
}
