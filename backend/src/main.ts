import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4173',                   // local dev
      'https://posbuzz-2-frontend.onrender.com' // production frontend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization', // ✅ important for JSON + tokens
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
