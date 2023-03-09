import { Controller, Get, Put, Param, Body, Render, ParseIntPipe, Res, Post } from '@nestjs/common';
import { AccountCard, ConnectionTable, Prisma } from '@prisma/client';
import { AccountCardService } from 'src/account-card/account-card.service';

@Controller('api')
export class CardController {
    constructor(private _cardServise: AccountCardService) { }

    @Get('/')
    redirectFromRestAPI(@Res() res) {
        return res.redirect('/api/card/list')
    }

    @Get('/card')
    redirectFromRestAPICard(@Res() res) {
        return res.redirect('/api/card/list')
    }

    @Render('index')
    @Get('/card/list')
    async getActualCard(): Promise<{ content: AccountCard[] | string }> {
        let cards: AccountCard[] = await this._cardServise.getActualCard()
        return { content: (cards.length === 0) ? "Карточек нет" : cards }
    }

    @Render('versions')
    @Get('/card/versions/:id')
    async getCardById(@Param('id', ParseIntPipe) id: number): Promise<{ content: AccountCard[] | string }> {
        let cards: AccountCard[] = await this._cardServise.getCardById(id)
        return { content: (cards.length === 0) ? "Карточек нет" : cards }
    }

    @Render('field')
    @Get('/card/get/:id/:version?')
    async getCardByIdAndVersion(@Param('id', ParseIntPipe) id: number,
        @Param('version') version?: string): Promise<{ content: ConnectionTable[] | string }> {
        let setVersion: number = (version === undefined) ? null : parseInt(version)
        let connectionTables: ConnectionTable[] | string = await this._cardServise.getCardByIdAndVersion(id, setVersion)
        return { content: connectionTables }
    }

    @Render('put')
    @Get('/card/put')
    async getPut(): Promise<{
        content: string | ConnectionTable[],
        dedupticationTables: string | ConnectionTable[]
    }> {
        return {
            content: await this._cardServise.getFieldCards(),
            dedupticationTables: await this._cardServise.getDeduplicationFieldCards()
        }
    }

    @Post('/card/put')
    async createNewCard(@Body() data: {
        accountCard: Prisma.AccountCardCreateInput,
        fieldCard: Prisma.FieldCardCreateManyInput[],
        fieldCardValue: { Value: string }[]
    }): Promise<{ message: string }> {
        console.log(data)
        return { message: await this._cardServise.createNewCard(data.accountCard, data.fieldCard, data.fieldCardValue) }
    }

    @Post('/card/patch')
    async editCard(@Body() data: {
        accountCard: Prisma.AccountCardCreateInput,
        fieldCard: Prisma.FieldCardCreateManyInput[],
        fieldCardValue: { Value: string }[]
    }): Promise<{ message: string }> {
        return { message: await this._cardServise.editCard(data.accountCard, data.fieldCard, data.fieldCardValue) }
    }
}
