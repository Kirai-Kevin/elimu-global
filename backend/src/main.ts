import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter.js';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as fs from 'fs';
import { HttpAdapterHost } from '@nestjs/core';

// Get the current file's path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function bootstrap() {
  // Create uploads directory if it doesn't exist
  const uploadsDir = join(__dirname, '..', 'uploads', 'courses');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'],
  });

  // Enable CORS for all routes
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://elimu-global.com'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Global exception filter
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));

  const port = process.env.PORT || 8000;
  const logger = new Logger('Bootstrap');

  await app.listen(port, () => {
    logger.log(`Server running on port ${port}`);
  });
}

bootstrap().catch(err => {
  console.error('Error during application bootstrap:', err);
  process.exit(1);
});
