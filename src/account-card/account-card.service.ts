import { Injectable } from '@nestjs/common';
import { AccountCard, ConnectionTable, Prisma, FieldCard, ValueInteger, ValueString, ConnectionTableDeduplication } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

//Сервис для работы с учётными карточками
@Injectable()
export class AccountCardService {
    constructor(private prisma: PrismaService) { }

    //Вывод списка актуальных карточек
    async getActualCard(): Promise<AccountCard[] | null> {
        try {
            let accountCards = await this.prisma.accountCard.findMany({
                where: {
                    Status: "Actual"
                }
            })

            accountCards.forEach(accountCard => {
                let condition: boolean = true
                for (let i = 0; i < accountCards.length; i++) {
                    if (accountCard.CardId === accountCards[i].CardId && !condition) {
                        accountCards.splice(i, 1)
                    }
                    else if (accountCard.CardId === accountCards[i].CardId && condition) condition = false
                }
            });
            return accountCards
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

    //Поиск карточки по её ID и номеру версии 
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
            if (card === null)
                //Возврат сообщения пользователю
                return 'Такой карточки нет'
            else {
                let connectinTable = await this.prisma.connectionTable.findMany({
                    where: {
                        AccountCardId: card.Id
                    },
                    //Включаем в результат поиска все связанные таблицы
                    include: {
                        AccountCard: true,
                        FieldCard: true,
                        ValueInteger: true,
                        ValueString: true
                    },
                    orderBy: {
                        FieldCardName: 'asc'
                    }
                })
                if (connectinTable.length === 0)
                    //Возврат сообщения пользователю
                    return 'У этой карточки нет таблицы соединений'
                else
                    //Возврат полей
                    return connectinTable
            }
        }
        catch (e) {
            console.warn(e)
            //Возврат сообщения при возникновении ошибки
            return 'Произошла ошибка'
        }
    }

    async getDeduplicationFieldCards(): Promise<string | ConnectionTableDeduplication[]> {
        try {
            let tables = await this.prisma.connectionTableDeduplication.findMany({
                include: {
                    FieldCard: true,
                    ValueInteger: true,
                    ValueString: true
                },
                orderBy: { FieldCardName: 'asc' }
            })
            //Возврат сообщения пользователю в случае отсутствия полей
            if (tables.length === 0) return 'Полей отсутствуют'
            //Отправление полей на страницу 
            return tables
        }
        catch (e) {
            console.warn(e)
            //Возврат сообщения при возникновении ошибки
            return 'Произошла ошибка'
        }
    }

    async getFieldCards(): Promise<string | ConnectionTable[]> {
        try {

            //Получение всех
            let tables = await this.prisma.connectionTable.findMany({
                include: {
                    FieldCard: true,
                    ValueInteger: true,
                    ValueString: true
                },
                orderBy: { FieldCardName: 'asc' }
            })

            if (tables.length === 0) {
                //Возврат сообщения пользователю в случае отсутствия полей
                return 'Поля отсутствуют'
            }

            //Удаление из выборки повторяющихся элементов
            tables.forEach(function (table) {
                let condition: boolean = true
                for (let i = 0; i < tables.length; i++) {
                    if (table.FieldCardName === tables[i].FieldCardName
                        && table.ValueIntegerId === tables[i].ValueIntegerId
                        && table.ValueStringId === tables[i].ValueStringId
                        && condition) {
                        condition = false
                    }
                    else if (table.FieldCardName === tables[i].FieldCardName
                        && table.ValueIntegerId === tables[i].ValueIntegerId
                        && table.ValueStringId === tables[i].ValueStringId
                        && !condition) {
                        tables.splice(i, 1)
                    }
                }
            })
            //Отправление полей на страницу 
            return tables
        }
        catch (e) {
            console.warn(e)
            //Возврат сообщения при возникновении ошибки
            return 'Произошла ошибка'
        }
    }

    async createNewCard(accountCard: Prisma.AccountCardCreateInput,
        fieldCard: Prisma.FieldCardCreateManyInput[],
        fieldCardValue: { Value: string }[]
    ): Promise<string> {
        accountCard.NumberVersion = parseInt(String(accountCard.NumberVersion))

        let checkCard = await this.prisma.accountCard.findFirst({
            where: {
                CardId: parseInt(String(accountCard.CardId))
            }
        })

        if (checkCard != undefined) return 'Карточка с таким идентификатором присутствует в системе'

        //Вызов метода, который создаёт новую учётную карточку
        let getCard = await this.createNewAccountCard(accountCard)

        //Проверка на возврат ошибки
        if (typeof (getCard) === 'string') return getCard
        else {
            //Вызов метода для привязки полей к карточке
            return await this.createNewFieldsCards(getCard, fieldCard, fieldCardValue)
        }
    }

    async editCard(arrayTables: Prisma.ConnectionTableCreateManyInput[],
        accountCard: Prisma.AccountCardCreateInput): Promise<string> {
        try {
            accountCard.NumberVersion = parseInt(String(accountCard.NumberVersion)) + 1

            //Вызов метода, который создаёт новую учётную карточку
            var getCard = await this.createNewAccountCard(accountCard)

            //Проверка на возврат ошибки
            if (typeof (getCard) === 'string') return getCard
            else {
                //Вызов метода для привязки полей к карточке
                return await this.createNewConnectionTables(arrayTables, getCard)
            }
        }
        catch (e) {
            console.warn(e)
            //Возврат сообщения при возникновении ошибки
            return "Произошла ошибка при создании карточки"
        }
    }

    private async createNewAccountCard(accountCard: Prisma.AccountCardCreateInput, numberVersion: number = 1): Promise<AccountCard | string> {
        try {
            accountCard.NumberVersion = numberVersion
            accountCard.CardId = parseInt(String(accountCard.CardId))
            accountCard.DateOfCreateVersion = new Date()

            //Внесение карточки в БД и возврат внесённой записи
            return await this.prisma.accountCard.create({ data: accountCard })
        }
        catch (e) {
            console.warn(e)
            //Возврат сообщения при возникновении ошибки
            return 'Произошла ошибка при создании карточки'
        }
    }

    private async createNewFieldsCards(
        accountCard: AccountCard,
        fieldsCards: Prisma.FieldCardCreateManyInput[],
        fieldsCardsValue: { Value: string }[]): Promise<string> {
        let errors = []
        let regexp = new RegExp('[^0-9]', 'g')
        for (let i = 0; i < fieldsCards.length; i++) {
            let value: ValueInteger | ValueString
            try {
                fieldsCards[i].DataType = regexp.test(fieldsCardsValue[i].Value) ? 'String' : 'Integer'
                await this.prisma.fieldCard.create({ data: fieldsCards[i] })
            }
            catch (e) {
                console.warn(e)
                errors.push(fieldsCards[i].Name)
                continue
            }
            try {
                if (fieldsCards[i].DataType === 'String')
                    value = await this.prisma.valueString.create({ data: <Prisma.ValueStringCreateManyInput>fieldsCardsValue[i] })
                else if (fieldsCards[i].DataType === 'Integer') {
                    var intValue = <Prisma.ValueIntegerCreateManyInput>{ Value: parseInt(fieldsCardsValue[i].Value) }
                    value = await this.prisma.valueInteger.create({ data: intValue })
                }
            }
            catch (e) {
                console.warn(e)
                errors.push('значение поля: ' + fieldsCards[i].Name)
                await this.prisma.fieldCard.delete({
                    where: {
                        Name: fieldsCards[i].Name
                    }
                })
                continue
            }
            try {
                let connectionTable = <Prisma.ConnectionTableCreateManyInput>{
                    AccountCardId: accountCard.Id,
                    FieldCardName: fieldsCards[i].Name,
                    ValueIntegerId: fieldsCards[i].DataType === 'Integer' ? value.Id : null,
                    ValueStringId: fieldsCards[i].DataType === 'String' ? value.Id : null
                }
                await this.prisma.connectionTable.create({ data: connectionTable })
            }
            catch (e) {
                console.warn(e)
                errors.push('ошибка при добавлении поля: ' + fieldsCards[i].Name)
                await this.prisma.$transaction(async (prisma) => {
                    await prisma.fieldCard.delete({ where: { Name: fieldsCards[i].Name } })
                    if (fieldsCards[i].DataType === 'String')
                        await prisma.valueString.delete({ where: { Id: value.Id } })
                    else (fieldsCards[i].DataType === 'Integer')
                    await prisma.valueInteger.delete({ where: { Id: value.Id } })
                })
            }
        }
        console.log(errors)
        return errors.length === 0 ? 'Успешно' : 'Поля ' + errors.join(', ') + ' присутствуют в системе'
    }

    private async createNewConnectionTables(arrayTables: Prisma.ConnectionTableCreateManyInput[],
        accountCard: AccountCard): Promise<string> {
        try {
            //Добавление связей к таблице соединений
            arrayTables.forEach(function (table) {
                table.AccountCardId = accountCard.Id
                table.ValueIntegerId = (String(table.ValueIntegerId) === '')
                    ? null : parseInt(String(table.ValueIntegerId))
                table.ValueStringId = (String(table.ValueStringId) === '')
                    ? null : parseInt(String(table.ValueStringId))
            })

            //Внесение таблиц соединений в БД
            await this.prisma.connectionTable.createMany({ data: arrayTables })
            return 'Успешно'
        }
        catch (e) {
            console.warn(e)
            //Возврат сообщения при возникновении ошибки
            return 'Ошибка при создание таблиц соединений'
        }
    }
}