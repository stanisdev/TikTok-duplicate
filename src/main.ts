import { NestFactory } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(3000);
}
bootstrap();
