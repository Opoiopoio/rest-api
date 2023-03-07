import { Module } from '@nestjs/common';
import { CardController } from './card/card.controller';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';
import { AccountCardService } from './account-card/account-card.service';

@Module({
  imports: [],
  controllers: [CardController, AppController],
  providers: [PrismaService, AccountCardService],
})
export class AppModule {}
