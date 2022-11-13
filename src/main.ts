import 'dotenv/config';
import { App } from './core/app';

async function bootstrap() {
  const app = new App();
  const PORT = process.env.PORT || '3000';

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);

  process.on('SIGTERM', app.close);
  process.on('SIGINT', app.close);
}

void bootstrap();
