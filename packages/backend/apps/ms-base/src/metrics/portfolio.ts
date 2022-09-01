
import {OperationState} from "tinkoff-invest-api/cjs/generated/operations";

import {OperationType, GetOperationsByCursorRequest} from "tinkoff-invest-api/cjs/generated/operations";
import moment from "moment";
import clickhouse from "../db/clickhouse/clickhouse";
import {ACCOUNT} from "../../../ms-ti-base/users.service";
import {api} from "../../../ms-ti-base/api";
import {toNum} from "../../../ms-ti-base/number";
import {delay} from "../../../ms-ti-base/wait";


const EXEC3 = async () => {
    //const positions = await api.orders.getOrderState()
    //const positions = await api.operations.
    //const positions = await api.operations.getBrokerReport({})

}
const EXEC2 = async () => {
    const positions = await api.operations.getPositions({accountId: ACCOUNT.IIS});
    console.log(positions)
}
//EXEC2()

const select = async () => {
    const rows: any[] = await clickhouse.query('SELECT * FROM operations.GetPortfolio').toPromise();
    // for(let row of rows) {
    //     console.log(row)
    // }

    const iis = rows.filter(row => row.account_name === 'ИИС')[0];
    console.log(iis['account_name'])
    console.log(iis['total'])
    console.log(iis['currency'])
}
//select()
const EXEC = async () => {


    const accounts = await api.users.getAccounts({});
    //accounts.accounts.filter(account => account.id === ACCOUNT.IIS)
    const ops = await api.operations.getOperationsByCursor({
        accountId: ACCOUNT.IIS,
        instrumentId: 'BBG0013HGFT4',
        from: moment('2022-01-01').toDate(),
        to: moment('2022-08-22').toDate(),
        cursor: "",
        limit: 250,
        /** Тип операции. Принимает значение из списка OperationType. */
        operationTypes: [
            OperationType.OPERATION_TYPE_BUY_CARD,
            //OperationType.OPERATION_TYPE_INPUT,
            // OperationType.OPERATION_TYPE_SELL,
            // OperationType.OPERATION_TYPE_BUY,
            // OperationType.OPERATION_TYPE_OUTPUT
        ],
        state: OperationState.OPERATION_STATE_EXECUTED,
        withoutCommissions: false,
        withoutTrades: false,
        withoutOvernights: true
    })
    console.log(ops.items);

    //const resp = await api.instruments.currencies({ instrumentStatus: InstrumentStatus.UNRECOGNIZED});

    //await asyncWriteFile('../../currencies_status_unrecognized.json', prettyJSON(resp))

}
//EXEC()
export const get_portfolio_balance = async () => {
    const accounts = await api.users.getAccounts({});

    for (let account of accounts.accounts) {
        if (account.name === 'Инвесткопилка') return;

        const portfolio = await api.operations.getPortfolio(({accountId: account.id}));

        const totalAmountCurrencies = portfolio.totalAmountCurrencies
        const totalAmountShares = portfolio.totalAmountShares
        const totalAmountBonds = portfolio.totalAmountBonds
        const totalAmountEtf = portfolio.totalAmountEtf
        const total = toNum(totalAmountCurrencies)! + toNum(totalAmountShares)! + toNum(totalAmountBonds)! + toNum(totalAmountEtf)!;

        const figi = 'BBG0013HGFT4'
        const $_resp = await api.marketdata.getLastPrices({figi: [figi]});
        const $ = $_resp.lastPrices.filter(it => it.figi === figi)[0];


        // console.log('account id: ' + account.id)
        // console.log('account status: ' + account.status)
        // console.log('account type: ' + account.type)
        // console.log('account accessLevel: ' + account.accessLevel)
        // console.log('account name: ' + account.name)

        const now = moment();


        const query = 'INSERT INTO operations.GetPortfolio (*) VALUES (' +
            "parseDateTimeBestEffortOrNull('" + now.toISOString() + "')," +
            "'" + now.format('YYYY-MM-DD') + "'," +
            "'" + account.id + "'," +
            "'" + account.name + "'," +
            "'" + totalAmountCurrencies?.currency + "'," +
            total + ',' +
            toNum(totalAmountCurrencies) + ',' +
            toNum(totalAmountShares) + ',' +
            toNum(totalAmountBonds) + ',' +
            toNum(totalAmountEtf) + ',' +
            account.type + ',' +
            account.status + ',' +
            account.accessLevel + ');';

        await clickhouse.query(query).toPromise();

        // console.log(total + ' ' + totalAmountCurrencies?.currency)
        // console.log(total / toNum($.price)! + ' usd')
        // console.log(toNum(totalAmountCurrencies) + ' ' + totalAmountCurrencies?.currency)
        // console.log(toNum(totalAmountCurrencies)! / toNum($.price)! + ' usd')
        // console.log(toNum(totalAmountShares) + ' ' + totalAmountShares?.currency)
        // console.log(toNum(totalAmountBonds) + ' ' + totalAmountBonds?.currency)
        // console.log(toNum(totalAmountEtf) + ' ' + totalAmountEtf?.currency)


        // clickhouse create table
        // dt account total ... totalAmountEtf  или перенести в редис

        //await delay(30000)

        //const positions = await api.operations.getPositions({ accountId: account.id });
        // console.log(positions)
        // блок money = перекрёстная проверка

        //await delay(30000)

        // const operations = await api.operations.getOperations({
        //     accountId: account.id,
        //     from: moment('2022-08-22').toDate(),
        //     to: moment('2022-08-22').toDate(),
        //     state: OperationState.OPERATION_STATE_EXECUTED,
        //
        // });


        // const order_book = await api.operations.getPositions({ accountId: account.id });
        //
        // order_book.securities.
        // api.instruments.
        //
        //     account.name
    }

    //await delay(30000).then(() => { console.log('delay = ' + moment().format('YYYY-MM-DD HH:mm:ss'))})
    //const orderBook = await api.marketdata.getOrderBook()


    //for(let counter of [1...1000])


}


const exec2= async () => {
    console.log(moment().toISOString())
    await get_portfolio_balance();
}

//exec2()
const exec = async () => {

    for (;;) {
        await delay(15000).then(() => {
            console.log('delay = ' + moment().format('YYYY-MM-DD HH:mm:ss'))
        })
        await get_portfolio_balance();
    }
}
exec().then(() => { console.log('exec = ' + moment().format('YYYY-MM-DD HH:mm:ss'))})
