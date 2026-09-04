import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sécurité : En-têtes HTTP (Helmet)
  app.use(helmet());

  // Sécurité : CORS (Cross-Origin Resource Sharing)
  // Restriction aux domaines autorisés uniquement
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle("API REST 'nom_de_votre_app' ")
      .setVersion('1.5')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }
  const port = process.env.PORT
  await app.listen(port || 3001);
}
bootstrap();
