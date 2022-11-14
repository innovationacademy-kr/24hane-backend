import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const log_level: LogLevel[] =
    process.env.LOG_DEBUG === 'true'
      ? ['error', 'log', 'verbose', 'debug']
      : ['error', 'log', 'verbose'];

  const app = await NestFactory.create(AppModule, {
    logger: log_level,
  });
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
    .setTitle('24Hane API 명세서')
    .setDescription('24Hane API 명세서입니다. (by joopark)')
    .setVersion(process.env.npm_package_version)
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(parseInt(process.env.PORT, 10));
}
bootstrap();
