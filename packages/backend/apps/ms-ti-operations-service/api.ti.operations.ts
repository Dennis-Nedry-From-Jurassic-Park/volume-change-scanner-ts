import secrets from '../ms-base/src/utility-methods/env';

import {TinkoffInvestApi} from 'tinkoff-invest-api';
import {OperationsResponse, OperationState, Operation, PositionsSecurities} from "tinkoff-invest-api/cjs/generated/operations"; // TODO: dist
import {InstrumentStatus, InstrumentIdType} from "tinkoff-invest-api/cjs/generated/instruments"; // TODO: dist
import moment from 'moment';
import {arrayToTree} from "performant-array-to-tree";
import {CandleInterval, LastPrice} from "tinkoff-invest-api/cjs/generated/marketdata";
import {ACCOUNT} from "../ms-ti-base/users.service";
import {instrumentsService} from "../ms-ti-base/instruments.service";
import {prettyJSON} from "../ms-ti-base/output";
import {toNum} from "../ms-ti-base/number";

const token = secrets.token!;

const api = new TinkoffInvestApi({ token: token });

const get_operations = async (
    accountId: typeof ACCOUNT,
    from: Date,
    to: Date,
    state: OperationState,
    figi: string,
): Promise<OperationsResponse>  => {
    return await api.operations.getOperations({
        accountId: accountId,
        from: from,
        to: to,
        state: state,
        figi: figi,
    });
}

const exec = async () => {
    const share = await instrumentsService.get_share_by_ticker('PLTR');

    const format = "YYYY-MM-DD"
    const start = '2022-08-05'
    const end = moment(start).add(1, "days").format(format);

    const ops = await get_operations(
        ACCOUNT.IIS,
        moment(start,format).toDate(),
        moment(end,format).toDate(),
        OperationState.OPERATION_STATE_EXECUTED,
        share.figi // фильтруем или все тикеры + фильтр по дате обязателен
    );

    const config = { id: "id", parentId: "parentOperationId", childrenField: "nodes" }

    const operations = ops.operations;
    const tree = arrayToTree(operations, config);

    let fees = 0; let payment = 0;

    tree.forEach( (operation:any) => {
        const payment_elem = toNum(operation.data.payment)!

        operation.nodes.forEach( async (node:any) => {
            fees += toNum(node.data.payment)!
            const date = node.data.date;
            const from = moment(date).subtract(30,'seconds').toDate();
            const to = moment(date).add(30,'seconds').toDate();

        })

        //const fees_elem = toNum(operation.nodes.payment)!
        console.log(fees)
        console.log(payment_elem)
        payment = payment + payment_elem;
    });

    console.log(payment)

    const total = payment + fees;
    console.log(total)

    const prev = (await get_$_price('2022-08-05T16:00:00.000Z') || 1) * total
    const exec = 12 * 15 * 60.605 - Math.abs(prev)

    console.log(prev)
    console.log("exec = " + exec)

    const positions = await api.operations.getPositions({accountId: ACCOUNT.IIS})


    const num_shares = positions.securities.filter((position: PositionsSecurities) => {
        return position.figi === share.figi
    })[0].balance

    const last_price = await api.marketdata.getLastPrices({figi: [share.figi]});
    const quotation = last_price.lastPrices.filter((lastPrice: LastPrice) => { return lastPrice.figi === share.figi})[0].price

    const lastPrice = toNum(quotation)!




    const currCurrency = (await get_$_price(moment().toISOString()) || 1);

    console.log( lastPrice )
    console.log( num_shares )
    console.log( currCurrency )
    console.log( lastPrice * num_shares * currCurrency )
    console.log(share.figi)

}
const get_$_price = async (date: string): Promise<number | undefined > => {
    const from = moment(date).subtract(59,'seconds');
    const to = moment(date).add(59,'seconds');
    console.log(from.startOf('minute'))
    console.log(to.startOf('minute'))
    const candles =
        await api.marketdata.getCandles({
            figi: 'BBG0013HGFT4',
            from: from.toDate(),
            to: to.toDate(),
            interval: CandleInterval.CANDLE_INTERVAL_1_MIN
        })

    if(candles.candles.length === 0) {

        // учесть date-time закрытия торгового дня
        // тут добавить кликхауз таблицу и архив свечей (минутки)
        // каждый вечер скрипт апдейтит
    }

    console.log(prettyJSON(candles))

    const currencyBuy = toNum(candles.candles[0].high);

    console.log(currencyBuy)

    return currencyBuy


   // const dollar = toNum(candles.candles[0].close);
}

const algo3 = async () => {
    const share = await instrumentsService.get_share_by_ticker('DINO');

    const resp = await api.instruments.getInstrumentBy({
        idType: InstrumentIdType.INSTRUMENT_ID_TYPE_FIGI,
        classCode: '',
        id: share.figi
    });
    const resp2 = await api.instruments.shareBy({
        idType: InstrumentIdType.INSTRUMENT_ID_TYPE_FIGI,
        classCode: '',
        id: share.figi
    });

    console.log(prettyJSON(resp))
    console.log(prettyJSON(resp2))

}
const algo2 = async () => {
    const date = moment.now()
    const from = moment(date).subtract(0,'days').toDate()
    const to = moment(date).toDate()

    console.log(date)
    console.log(from)
    console.log(to)

    const resp = await api.instruments.tradingSchedules({
        exchange: 'MOEX',
        from: from,
        to: to

    })
    console.log(prettyJSON(resp.exchanges.filter((e:any) => { return e.exchange === 'MOEX'})[0].days[0].startTime))
    console.log(prettyJSON(resp))
}

const algo = async () => {
    const currencies =
        await api.instruments.currencies({ instrumentStatus: InstrumentStatus.INSTRUMENT_STATUS_BASE });
    console.log(currencies.instruments.filter((i: any) => { return i.currency === 'rub'}))
    //api.instruments.currencyBy({ currency: 'USD'})
};


exec();

//exec();


/*

{
    figi: 'BBG0013HGFT4',
    ticker: 'USD000UTSTOM',
    classCode: 'CETS',
    isin: '',
    lot: 1000,
    currency: 'rub',
    klong: { units: 2, nano: 0 },
    kshort: { units: 2, nano: 0 },
    dlong: { units: 0, nano: 500000000 },
    dshort: { units: 0, nano: 500000000 },
    dlongMin: { units: 0, nano: 292900000 },
    dshortMin: { units: 0, nano: 224700000 },
    shortEnabledFlag: true,
    name: 'Доллар США',
    exchange: 'FX',
    nominal: { currency: 'usd', units: 1, nano: 0 },
    countryOfRisk: '',
    countryOfRiskName: '',
    tradingStatus: 1,
    otcFlag: false,
    buyAvailableFlag: true,
    sellAvailableFlag: true,
    isoCurrencyName: 'usd',
    minPriceIncrement: { units: 0, nano: 2500000 },
    apiTradeAvailableFlag: true,
    uid: 'a22a1263-8e1b-4546-a1aa-416463f104d3',
    realExchange: 1
  },

 */