import { HttpExceptionFilter } from './common/exceptions/http-exception.fillter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = process.env.PORT;
  await app.listen(port);
}
bootstrap();
