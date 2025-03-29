import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AppConfig } from './config/configuration';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const appConfig = configService.get<AppConfig>('app');

    if (!appConfig) {
      throw new Error('Application configuration is not available');
    }

    // Configure Swagger
    const config = new DocumentBuilder()
      .setTitle('GTFS API')
      .setDescription('The GTFS API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Configure global validation pipe with class-transformer
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        enableDebugMessages: true,
        whitelist: true,
      }),
    );

    // Use global logger interceptor
    app.useGlobalInterceptors(new LoggerInterceptor());

    // Use global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Enable CORS
    app.enableCors();
    
    await app.listen(appConfig.port);
    console.log(`Application is running on: http://localhost:${appConfig.port} in ${appConfig.nodeEnv} mode`);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
