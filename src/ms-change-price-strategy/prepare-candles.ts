import {RealExchange, Share} from "tinkoff-invest-api/cjs/generated/instruments";
import clickhouse from "../db/clickhouse/clickhouse";
import {asyncReadFile, asyncWriteFile} from "../utility-methods/file";
import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";
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
    minTime: 1250,
    trackDoneStatus: true
});

const insert_candles = async (
    tickers: string[],
    from: string,
    to: string,
    timeframe: CandleInterval
) => {
    let ins_rows: any[] = [];

    for (const ticker of tickers) {
        await delay(250)

        const share = await instrumentsService.get_share_by_ticker(ticker);

        const candles = await bottleneck.schedule(async () => {
            try {
                return  api.marketdata.getCandles({
                    figi: share.figi,
                    from: moment(from).toDate(),
                    to: moment(to).toDate(),
                    interval: timeframe
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
                tf: timeframe,
                //currency: share.currency,
                //exchange: share.exchange,
                //apiTradeAvailableFlag: share.apiTradeAvailableFlag

            }
        });

        for (const row of rows) { ins_rows.push(row); }
    }

    const query = await insert_into_table_multiple('GetCandles', ins_rows)
    console.log(query);
    await asyncWriteFile('../../query.json', query)
    console.log('count = ' + ins_rows.length);

    const queries:any[] = [query];

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

    await insert_candles(
        tickers,
        '2022-08-20',
        '2022-08-21',
        CandleInterval.CANDLE_INTERVAL_DAY
    );

    console.log('empty_tickers = ' + empty_tickers)
}
//const tickers: string[] = require('../ms-crawler/spbe.10_00_main_session.tickers.json');
//exec0(tickers);


const insert_candles_to_all_usa_shares_except_morning_session = async () => {
    let tickers_10_00_main_session: string[] = require('../ms-crawler/spbe.10_00_main_session.tickers.json');
    const all_usa_shares = await instrumentsService.get_all_american_shares();
    let all_usa_tickers: string[] = all_usa_shares.map(it => it.ticker)
    let combined_tickers = all_usa_tickers.filter((item: string) => tickers_10_00_main_session.indexOf(item) < 0);
    exec0(combined_tickers);
}
//insert_candles_to_all_usa_shares_except_morning_session()



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

