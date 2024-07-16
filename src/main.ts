import { LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  const configService = app.get(ConfigService);
  const cors_uri = configService.get<string>('frontend.uri');
  const version = configService.get<string>('version');

  // enable CORS if exists
  if (cors_uri) {
    app.enableCors({
      origin: cors_uri,
      credentials: true,
    });
  }

  // for URI Versioning
  app.enableVersioning();

  // for Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('24Hane API 명세서')
    .setDescription('24Hane API 명세서입니다. (by joopark)')
    .setVersion(version)
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  const port = configService.getOrThrow<number>('port');

  await app.listen(port);
}

bootstrap();
