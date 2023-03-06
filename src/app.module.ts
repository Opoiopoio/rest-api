import { Module } from '@nestjs/common';
import { CardController } from './card/card.controller';
import { PrismaService } from './prisma/prisma.service';
import { AccountCardService } from './account-card/account-card.service';

@Module({
  imports: [],
  controllers: [CardController],
  providers: [PrismaService, AccountCardService],
})
export class AppModule {}
