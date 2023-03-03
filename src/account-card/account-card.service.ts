import { Injectable } from '@nestjs/common';
import { AccountCard, ConnectionTable, Prisma, ValueInteger, ValueString } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountCardService {
    constructor(private prisma: PrismaService) { }

    async getActualCard(): Promise<AccountCard[] | null> {
        try {
            return await this.prisma.accountCard.findMany({
                where: {
                    Status: "Actual"
                }
            })
        }
        catch (e) {
            console.warn(e)
            return null
        }
    }

    async getCardById(id: number): Promise<AccountCard[] | null> {
        try {
            return await this.prisma.accountCard.findMany({
                where: {
                    Id: id
                }
            })
        }
        catch (e) {
            console.warn(e)
            return null
        }
    }

    async getCardByIdAndVersion(id: number, version?: string): Promise<ConnectionTable[] | string> {
        try {
            let card: AccountCard
            if (version != null) {
                card = await this.prisma.accountCard.findFirst({
                    where: {
                        Id: id,
                        NumberVersion: version
                    }
                })
            }
            else {
                card = await this.prisma.accountCard.findFirst({
                    where: {
                        Id: id,
                    },
                    take: -1
                })
            }
            if (card === null) return 'Такой карточки нет'
            else {
                let connectinTable = await this.prisma.connectionTable.findMany({
                    where: {
                        AccountCardNumberVersion: card.NumberVersion
                    },
                    include: {
                        AccountCard:true,
                        FieldCard: true,
                        ValueInteger: true,
                        ValueString: true
                    }
                })
                if (connectinTable.length === 0) return 'У этой карточки нет таблицы соединений'
                else return connectinTable
            }
        }
        catch (e) {
            console.warn(e)
            return 'Произошла ошибка'
        }
    }

    async createNewCard(data: Prisma.AccountCardCreateInput): Promise<string> {
        try {
            await this.prisma.accountCard.create({ data })
            return "Успешно"
        }
        catch (e) {
            console.warn(e)
            return "Произошла ошибка при создании карточки"
        }
    }



    async editCard() { }
}