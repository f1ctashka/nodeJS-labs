import 'reflect-metadata';
import 'dotenv/config';

import { App } from './core/app';
import { UsersController } from './users/users.controller';
import { IndexController } from './index/index.controller';

async function bootstrap() {
  const app = new App();
  const PORT = process.env.PORT || '3000';

  app.registerControllers([UsersController, IndexController]);

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);

  process.on('SIGTERM', app.close);
  process.on('SIGINT', app.close);
}

void bootstrap();
