import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuramos CORS para permitir conexiones desde el frontend
  app.enableCors({
    origin: ['http://localhost:5173'], // Solo permitimos el puerto específico de nuestro frontend
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });
  
  const port = 4000; // Establecemos el puerto específico
  await app.listen(port);
  console.log(`Servidor NestJS ejecutándose en: http://localhost:${port}`);
}
bootstrap();
