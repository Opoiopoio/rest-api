import { Injectable } from '@nestjs/common';
import { AccountCard, ConnectionTable, Prisma, ValueInteger, ValueString } from '@prisma/client';
import { Console } from 'console';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountCardService {
    constructor(private prisma: PrismaService) { }

    //Вывод списка актуальных карточек
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

    //Поиск карточки по её Id 
    async getCardById(id: number): Promise<AccountCard[] | null> {
        try {
            return await this.prisma.accountCard.findMany({
                where: {
                    CardId: id
                }
            })
        }
        catch (e) {
            console.warn(e)
            return null
        }
    }

    async getCardByIdAndVersion(id: number, version?: number): Promise<ConnectionTable[] | string> {
        try {
            //Поиск карточки по её Id и версии
            let card: AccountCard
            if (version != null) {
                card = await this.prisma.accountCard.findFirst({
                    where: {
                        CardId: id,
                        NumberVersion: version
                    }
                })
            }
            else {
                card = await this.prisma.accountCard.findFirst({
                    where: {
                        CardId: id,
                    },
                    take: -1
                })
            }

            //Поиск полей карточки
            if (card === null) return 'Такой карточки нет'
            else {
                let connectinTable = await this.prisma.connectionTable.findMany({
                    where: {
                        AccountCardId: card.Id
                    },
                    include: {
                        AccountCard: true,
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

    async createNewCard() {

    }

    

    async editCard(arrayTables: Prisma.ConnectionTableCreateManyInput[], accountCard: Prisma.AccountCardCreateInput): Promise<string> {
        try {
            //Внесение новой версии учётной карточки в БД
            accountCard.NumberVersion = parseInt(String(accountCard.NumberVersion)) + 1
            accountCard.CardId = parseInt(String(accountCard.CardId))
            accountCard.DateOfCreateVersion = new Date()
            await this.prisma.accountCard.create({ data: accountCard })

            //Получение только что добавленной карточки
            var getCard = await this.prisma.accountCard.findFirst({
                where: {
                    Name: accountCard.Name,
                    CardId: accountCard.CardId,
                    DateOfCreateVersion: accountCard.DateOfCreateVersion
                }
            })

            //Добавление связи к таблице соединений
            arrayTables.forEach(function (table) {
                table.AccountCardId = getCard.Id
                table.ValueIntegerId = (String(table.ValueIntegerId) === '') ? null : parseInt(String(table.ValueIntegerId))
                table.ValueStringId = (String(table.ValueStringId) === '') ? null : parseInt(String(table.ValueStringId))
            })

            //Внесение таблиц соединений в БД
            await this.prisma.connectionTable.createMany({ data: arrayTables })
            return "Успешно"
        }
        catch (e) {
            console.warn(e)
            return "Произошла ошибка при создании карточки"
        }
    }
}