import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Obach bghiti ngolhalik')
    .setDescription('had l project naaaaaaaaddiiiiiii')
    .setVersion('1.0')
    .build();

  app.use(cors({
    origin: `http://${process.env.IP || "127.0.0.1" }:3000`,
  }));

  // Serve static files from the "public" directory
  
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT_BACK_END || 3333;
  
  app.use('/public', express.static('public'));

  await app.listen(port);
}

bootstrap();
