import {RealExchange, Share} from "tinkoff-invest-api/cjs/generated/instruments";
import clickhouse from "../db/clickhouse/clickhouse";
import {asyncReadFile} from "../utility-methods/file";
import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";
import {
    get_russian_shares
} from "../ms-ti-base/api.ti.service.utils";
import moment from "moment";
import {insert_into_table_multiple} from "../db/generate-schema/own-clickhouse-generator-scheme";
import Bottleneck from "bottleneck";
import assert from "assert";
import {delay} from "../ms-ti-base/wait";
import {toNum} from "../ms-ti-base/number";
import {instrumentsService} from "../ms-ti-base/instruments.service";
import {api} from "../ms-ti-base/api";

const try_it = async () => {
    let enumKey = RealExchange["1"];
    console.log(enumKey);
}

const bottleneck = new Bottleneck({
    minTime: 2500,
    trackDoneStatus: true
});

const insert_candles = async (
    tickers: string[],
    from: string,
    to: string,
    timeframe: CandleInterval,
    share: Share
) => {
    await delay(1000)

    let ins_rows: any[] = [];

    for (const ticker of tickers) {
        //console.log('ticker: ' + ticker)

        const tf = timeframe;

        const candles = await bottleneck.schedule(async () => {
            try {
                return  api.marketdata.getCandles({
                    figi: share.figi,
                    from: moment(from).toDate(),
                    to: moment(to).toDate(),
                    interval: tf
                });
            } catch (e:any) {
                console.log('failed to fetch candles for ticker ' + ticker + ' exception: ' + e.message)
            }
        });

        assert(candles !== undefined, 'Empty candles for ticker ' + ticker)

        const rows = candles.candles.map( ( row:any) => {
            let updated_row = row;
            updated_row.open = toNum(updated_row.open)
            updated_row.high = toNum(updated_row.high)
            updated_row.low = toNum(updated_row.low)
            updated_row.close = toNum(updated_row.close)

            return {
                ticker: ticker,
                figi: share.figi,
                ...updated_row,
                tf: tf,
                //currency: share.currency,
                //exchange: share.exchange,
                //apiTradeAvailableFlag: share.apiTradeAvailableFlag

            }
        });

        for (const row of rows) { ins_rows.push(row); }
    }

    //console.log(ins_rows);

    const query = await insert_into_table_multiple('GetCandles', ins_rows)
    console.log(query);
    console.log('count = ' + ins_rows.length);

    const queries:any[] = [
        query
    ];

    await clickhouse.logQueries(queries)



}

const exec = async () => {

    //const query = await asyncReadFile('../db/clickhouse/dto/instruments/create.table.shares.response.sql')
    //const query = await asyncReadFile('../db/clickhouse/dto/marketdata/create.table.get.candles.sql')
    const query = await asyncReadFile('../db/clickhouse/dto/marketdata/create.table.sql')
    //const query = await asyncReadFile('../db/clickhouse/dto/instruments/insert.into.table.shares.response.sql')

    const queries:any[] = [
        query
    ];
    await clickhouse.logQueries(queries)
}

const select = async (
    tickers: string[],
    from: string,
    to: string,
    timeframe: CandleInterval
) => {

    //const query = await asyncReadFile('../db/clickhouse/dto/instruments/create.table.shares.response.sql')
    //const query = await asyncReadFile('../db/clickhouse/dto/marketdata/create.table.get.candles.sql')
    const query = await asyncReadFile('../db/clickhouse/dto/marketdata/create.table.sql')
    //const query = await asyncReadFile('../db/clickhouse/dto/instruments/insert.into.table.shares.response.sql')

    const queries:any[] = [
        query
    ];
    await clickhouse.logQueries(queries)
}
const perf = async () => {
    console.log(moment())

    //const query = await asyncReadFile('../db/clickhouse/dto/instruments/create.table.shares.response.sql')
    //const query = await asyncReadFile('../db/clickhouse/dto/marketdata/create.table.get.candles.sql')
    const query = await asyncReadFile('../db/clickhouse/dto/marketdata/perf-sel.sql')
    //const query = await asyncReadFile('../db/clickhouse/dto/instruments/insert.into.table.shares.response.sql')

    const queries:any[] = [
        query
    ];
    await clickhouse.logQueries(queries)

    console.log(moment())
}

const exec0 = async (tickers: string[]) => {
    let empty_tickers: string[] = [];



    for (const ticker of tickers) {
        const share =  await instrumentsService.get_share_by_ticker(ticker)
        if(share === undefined) {
            empty_tickers.push(ticker)
            continue;
        } // внебиржевая бумага

        await delay(500)

        await insert_candles(
            [ticker], // , 'AMZN', 'TSN'
            '2022-08-19', //  03:00:00
            '2022-08-20',
            CandleInterval.CANDLE_INTERVAL_DAY,
            share
        );
    }

    console.log('empty_tickers = ' + empty_tickers)
}
const tickers: string[] = require('../ms-crawler/spbe.10_00_main_session.tickers.json');
exec0(tickers);

const rus = async () => {
    const apiTradeAvailableFlag = false
    const rus_shares = await instrumentsService.get_all_russian_shares();
    const tickers = rus_shares.map((it:Share) => { return it.ticker } )


    const figies = await instrumentsService.get_figies_by_tickers(tickers);
    // const resp = await api.marketdata.getLastPrices(({
    //     figi: figies
    // }))

    assert(tickers.length === figies.length, `tickers lenght ${tickers.length} !== figies lenght ${figies.length}`)

    //console.log(prettyJSON(resp.lastPrices.length))

    exec0(tickers);
}
//rus();


// perf();


//  \\wsl$\docker-desktop-data\version-pack-data\community\docker\volumes\
//  \\wsl$\docker-desktop-data\version-pack-data\community\docker\volumes\
// docker run -d --name clickhouse_host --ulimit nofile=262144:262144 -p 8123:8123 -v /clickhouse/log:/var/log/clickhouse-server -v /clickhouse/data:/var/lib/clickhouse yandex/c
// lickhouse-server:21.3.20.1
// docker run -it --rm --link clickhouse_host:clickhouse-server yandex/clickhouse-client:21.3.20.1 --host clickhouse-server --port 9000


//exec();

// AMZN=115+TSN=100


/*
amzn = 115
amzn = 61  = 176 + 6 = 182

nvda = 74
nvda = 116
total = 190

total = 372
 */