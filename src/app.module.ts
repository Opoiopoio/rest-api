import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CardController } from './card/card.controller';
import { PrismaService } from './prisma/prisma.service';
import { AccountCardService } from './account-card/account-card.service';

@Module({
  imports: [],
  controllers: [CardController],
  providers: [AppService, PrismaService, AccountCardService],
})
export class AppModule {}
