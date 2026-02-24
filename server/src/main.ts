import { NestFactory } from '@nestjs/core'; // 👈 บรรทัดที่ขาดไป
import { AppModule } from './app.module';   // 👈 บรรทัดที่ขาดไป

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    // ใส่ URL ของ Frontend (Vercel) ที่คุณได้มา
    origin: 'https://skill-test-for-fullstack-developer-five.vercel.app', 
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();