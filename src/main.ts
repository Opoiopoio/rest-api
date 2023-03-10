import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', '/src/wwwroot'));
  app.setBaseViewsDir(join(__dirname, '..', '/src/card/views'));
  app.setViewEngine('ejs');
  const prismaService = app.get(PrismaService);
  await prismaService.shutdownApp(app);
  await app.listen(3000);
}
bootstrap();
