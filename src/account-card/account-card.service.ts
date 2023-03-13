import { Injectable } from '@nestjs/common';
import { AccountCard, ConnectionTable, Prisma, FieldCard, ValueInteger, ValueString, ConnectionTableDeduplication } from '@prisma/client';
import { Stats } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

export type ValidateMessage = {
    Id: number,
    Message: string
}

//Сервис для работы с учётными карточками
@Injectable()
export class AccountCardService {
    constructor(private prisma: PrismaService) { }

    //Вывод списка актуальных карточек
    async getActualCard(): Promise<(Prisma.PickArray<Prisma.AccountCardGroupByOutputType, ("CardId" | "Name")[]> & {})[] | null> {
        try {
            let accountCards = await this.prisma.accountCard.groupBy({
                by: ['CardId', 'Name'],
                where: {
                    Status: "Actual"
                },
                orderBy: { CardId: 'asc' }
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
                    CardId: id,
                    Status: 'Actual'
                },
                orderBy: {
                    NumberVersion: 'asc'
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
                        NumberVersion: version,
                        Status: 'Actual'
                    },
                    orderBy: {
                        Name: 'asc'
                    }
                })
            }
            else {
                card = await this.prisma.accountCard.findFirst({
                    where: {
                        CardId: id,
                    },
                    take: -1,
                    orderBy: {
                        Name: 'asc'
                    }
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
                    AccountCard: true,
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

            //Получение всех таблиц соединений
            let tables = await this.prisma.connectionTable.findMany({
                include: {
                    AccountCard: true,
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
    ): Promise<string | ValidateMessage[]> {
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

    async editCard(accountCard: Prisma.AccountCardCreateInput,
        fieldCard: Prisma.FieldCardCreateManyInput[],
        fieldCardValue: { Value: string }[],
        connectionTables: Prisma.ConnectionTableCreateManyInput[]): Promise<string | ValidateMessage[]> {
        try {
            //Вызов метода, который создаёт новую учётную карточку
            var card = await this.editAccountCard(accountCard)

            //Проверка на возврат ошибки
            if (typeof (card) === 'string') return card
            else {
                if (await this.createNewConnectionTables(connectionTables, card) === 'Успешно') {
                    //Вызов метода для привязки полей к карточке
                    return await this.createNewFieldsCards(card, fieldCard, fieldCardValue)
                }
            }
        }
        catch (e) {
            console.warn(e)
            //Возврат сообщения при возникновении ошибки
            return "Произошла ошибка при создании карточки"
        }
    }

    private async editAccountCard(accountCard: Prisma.AccountCardUncheckedCreateInput): Promise<AccountCard | string> {
        try {
            accountCard.CardId = parseInt(String(accountCard.CardId))
            accountCard.NumberVersion = parseInt(String(accountCard.NumberVersion))
            let getCard = await this.prisma.$transaction(async (prisma) => {
                let card: Prisma.AccountCardWhereUniqueInput = await prisma.accountCard.findFirst({
                    where: {
                        NumberVersion: accountCard.NumberVersion,
                        CardId: accountCard.CardId
                    }
                })

                await prisma.accountCard.update({
                    where: {
                        Id: card.Id
                    },
                    data: accountCard
                })

                let lastCardThisVersion = await prisma.accountCard.findFirst({
                    where: { CardId: accountCard.CardId },
                    take: -1
                })

                accountCard.NumberVersion = lastCardThisVersion.NumberVersion + 1
                accountCard.Status = 'Actual'
                return await prisma.accountCard.create({
                    data: accountCard
                })
            })
            return getCard
        }
        catch (e) {
            console.warn(e)
            return 'Произошла ошибка при изменении карточки'
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
        fieldsCardsValue: { Value: string }[]): Promise<string | ValidateMessage[]> {
        if (fieldsCards === undefined) return 'Успешно'
        let errors = []
        let regexp = new RegExp('[^0-9]', 'g')
        for (let i = 0; i < fieldsCards.length; i++) {
            let value: ValueInteger | ValueString
            try {
                fieldsCards[i].DataType = regexp.test(fieldsCardsValue[i].Value) ? 'String' : 'Integer'
                await this.prisma.$transaction(async (prisma) => {
                    let checkFieldCard = await prisma.fieldCard.findFirst({
                        where: {
                            Name: fieldsCards[i].Name
                        }
                    })
                    if (checkFieldCard === null) {
                        let newField = await prisma.fieldCard.create({ data: fieldsCards[i] })
                        value = await this.createFieldValue(newField, fieldsCardsValue[i], prisma)
                        await this.createNewConnectionTable(accountCard, newField, value, prisma)
                    }
                    else if (checkFieldCard !== null && checkFieldCard.DataType === fieldsCards[i].DataType) {
                        value = await this.createFieldValue(fieldsCards[i], fieldsCardsValue[i], prisma)
                        await this.createNewConnectionTable(accountCard, fieldsCards[i], value, prisma)
                    }
                    else {
                        errors.push(<ValidateMessage>{
                            Id: i,
                            Message: 'Тип данных поля не совпадает с типом данных поля в системе'
                        })
                    }
                })
            }
            catch (e) {
                console.warn(e)
                errors.push(<ValidateMessage>{
                    Id: i,
                    Message: 'Ошибка при создании поля'
                })
            }
        }
        return errors.length === 0 ? 'Успешно' : errors
    }

    private async createFieldValue(fieldCard: FieldCard,
        fieldCardValue: { Value: string },
        prisma: Omit<PrismaService, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">):
        Promise<ValueInteger | ValueString> {
        if (fieldCard.DataType === 'String') {
            let checkValue = await prisma.valueString.findFirst({
                where: {
                    Value: fieldCardValue.Value
                }
            })
            if (checkValue === null)
                return await prisma.valueString.create({ data: <Prisma.ValueStringCreateManyInput>fieldCardValue })
            else return checkValue
        }
        else if (fieldCard.DataType === 'Integer') {
            var intValue = <Prisma.ValueIntegerCreateManyInput>{ Value: parseInt(fieldCardValue.Value) }
            let checkValue = await prisma.valueInteger.findFirst({
                where: {
                    Value: intValue.Value
                }
            })
            if (checkValue === null)
                return await prisma.valueInteger.create({ data: intValue })
            else return checkValue
        }
        return
    }

    private async createNewConnectionTable(
        accountCard: AccountCard,
        fieldCard: FieldCard,
        value: ValueInteger | ValueString,
        prisma: Omit<PrismaService, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">) {
        let connectionTable = <Prisma.ConnectionTableCreateManyInput>{
            AccountCardId: accountCard.Id,
            FieldCardName: fieldCard.Name,
            ValueIntegerId: fieldCard.DataType === 'Integer' ? value.Id : null,
            ValueStringId: fieldCard.DataType === 'String' ? value.Id : null
        }
        await prisma.connectionTable.create({ data: connectionTable })
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