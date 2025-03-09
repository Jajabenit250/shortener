import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import AppConfigs from './config/app-config/app.configs';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_DOCUMENTATION_PATH } from './common/constants/general.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  
  app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('URL SHORTENER')
    .setDescription('URL SHORTENER APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_DOCUMENTATION_PATH, app, document);

  await app.listen(AppConfigs.PORT || 3000);
}
bootstrap();
