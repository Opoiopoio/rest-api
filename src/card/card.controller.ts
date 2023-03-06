import { Controller, Get, Put, Patch, Param, Body, Render, ParseIntPipe, Res } from '@nestjs/common';
import { AccountCard, ConnectionTable, Prisma } from '@prisma/client';
import { AccountCardService } from 'src/account-card/account-card.service';

@Controller('rest-api/card')
export class CardController {
    constructor(private _cardServise: AccountCardService) { }

    @Get('/')
    redirect(@Res() res){
        return res.redirect('/rest-api/card/list')
    }

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
        @Param('version') version?: string): Promise<{ content: ConnectionTable[] | string }> {
        let setVersion: number = (version === undefined) ? null : parseInt(version)
        let connectionTables: ConnectionTable[] | string = await this._cardServise.getCardByIdAndVersion(id, setVersion)
        return { content: connectionTables }
    }

    @Render('put')
    @Get('put')
    async getPut(): Promise<{ content: string | ConnectionTable[] }> {
        return { content: await this._cardServise.getFieldCards() }
    }

    @Put('put')
    async createNewCard(@Body() data: {
        connectionTables: Prisma.ConnectionTableCreateManyInput[],
        accountCard: Prisma.AccountCardCreateInput
    }): Promise<{ message: string }> {
        return { message: await this._cardServise.createNewCard(data.connectionTables, data.accountCard) }
    }

    @Patch('patch')
    async editCard(@Body() data: {
        connectionTables: Prisma.ConnectionTableCreateManyInput[],
        accountCard: Prisma.AccountCardCreateInput
    }): Promise<{ message: string }> {
        return { message: await this._cardServise.editCard(data.connectionTables, data.accountCard) }
    }
}
