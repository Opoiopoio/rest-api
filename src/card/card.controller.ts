import { Controller, Get, Put, Param, Body, Render, ParseIntPipe } from '@nestjs/common';
import { AccountCard, ConnectionTable } from '@prisma/client';
import { AccountCardService } from 'src/account-card/account-card.service';

@Controller('card')
export class CardController {
    constructor(private _cardServise: AccountCardService) { }

    @Render('index')
    @Get('list')
    async getActualCard(): Promise<{ content: AccountCard[] | string }> {
        let cards: AccountCard[] = await this._cardServise.getActualCard()
        return { content: (cards.length === 0) ? "Карточек нет" : cards }
    }

    @Render('versions')
    @Get('versions/:id')
    async getCardById(@Param('id', ParseIntPipe) id: number): Promise<{ content: AccountCard[] | string }> {
        let cards: AccountCard[] = await this._cardServise.getCardById(id)
        return { content: (cards.length === 0) ? "Карточек нет" : cards }
    }

    @Render('field')
    @Get('get/:id/:version?')
    async getCardByIdAndVersion(@Param('id', ParseIntPipe) id: number,
        @Param('version') version: string): Promise<{ content: ConnectionTable[] | string }> {
            let connectionTables: ConnectionTable[] | string = await this._cardServise.getCardByIdAndVersion(id, version)
        return { content:  connectionTables}
    }

    @Put('put')
    async createNewCard(@Body() data: AccountCard): Promise<string> {
        return await this._cardServise.createNewCard(data)
    }
}
