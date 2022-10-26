import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable CORS if exists
  if (process.env.URL_FOR_CORS) {
    app.enableCors({
      origin: process.env.URL_FOR_CORS,
      credentials: true,
    });
  }

  // for URI Versioning
  app.enableVersioning();

  // for Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('체크인 API (version 3) 명세서')
    .setDescription('체크인 API (version 3) 명세입니다.')
    .setVersion('3.1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(parseInt(process.env.PORT, 10));
}
bootstrap();
