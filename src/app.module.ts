import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CardController } from './card/card.controller';

@Module({
  imports: [],
  controllers: [CardController],
  providers: [AppService],
})
export class AppModule {}
