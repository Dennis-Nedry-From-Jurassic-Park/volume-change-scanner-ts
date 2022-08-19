import {createHydratedMock, createMock} from 'ts-auto-mock';
import {
    EtfResponse,
    Share,
    TradingSchedule,
    TradingSchedulesResponse,
} from "tinkoff-invest-api/cjs/generated/instruments";
import {prettyJSON} from "../ms-ti-base/api.ti.service.utils";
import {asyncWriteFile} from "../utility-methods/file";
import {
    create_enum_field,
    create_table,
    insert_into_table, insert_into_table_multiple
} from "../db/generate-schema/own-clickhouse-generator-scheme";
import {CurrenciesResponse} from "tinkoff-invest-api/cjs/generated/instruments";
import {Currency, TradingDay} from "tinkoff-invest-api/src/generated/instruments";
import {SecurityTradingStatus} from "tinkoff-invest-api/cjs/generated/common";
import {ShareType} from "tinkoff-invest-api/cjs/generated/instruments";
import {RealExchange} from "tinkoff-invest-api/cjs/generated/instruments";
import {HistoricCandle} from "tinkoff-invest-api/cjs/generated/marketdata";

let GenerateSchema = require('generate-schema')


describe('reuse', () => {
    let mock: HistoricCandle;
    let mockDate: TradingDay;
    let mockCurrency: Currency;
    let mockSecurityTradingStatus: SecurityTradingStatus;
    let mockCurrenciesResponse: CurrenciesResponse;
    let mockEtfResponse: EtfResponse;
    const tableName = 'shares';

    beforeEach(async () => {
        mock = createHydratedMock<HistoricCandle>();
        mockDate = createHydratedMock<TradingDay>();
        // нет поддержки массивов
        mockCurrency = createHydratedMock<Currency>();
        mockCurrenciesResponse = createHydratedMock<CurrenciesResponse>({
            instruments: [mockCurrency]
        });
        mockEtfResponse = createHydratedMock<EtfResponse>();

        //console.log(mock)
        //console.log(prettyJSON(mock))
    });
    // it('should work', () => {
    //     expect(mock.figi).toContain('figi');
    // });
    //it('generate shares table', async () => {
       // let sharesTable = await create_table(tableName, mock, '\n')
       // console.log('sharesTable = ' + sharesTable);
    //});
    // it('generate insert into table', async () => {
    //    console.log('SharesResp table = ' + prettyJSON(mock));
    //    let it = await create_table('GetCandles', mock, '\n');
    //    console.log('TradingSchedules table = ' + it);
    // });
    it('generate insert into table', async () => {
       console.log('mockDate = ' + prettyJSON(mockDate));
       let it = await insert_into_table_multiple('GetCandles', [mockDate]);
       console.log('TradingSchedules table = ' + it);
    });
    //it('generate TradingSchedules table', async () => {
       //console.log('SharesResp table = ' + prettyJSON(mock));

       //let TradingSchedulesTable = await create_table('TradingSchedules', mock, '')
       //console.log('TradingSchedules table = ' + TradingSchedulesTable);
    //});
    // it('generate TradingSchedules mockEtfResponse', async () => {
    //     console.log('CurrenciesResponse table = ' + prettyJSON(mockCurrenciesResponse));
    //
    //     let mockTradingSchedulesResponseT = await create_table('CurrenciesResponse', mockCurrenciesResponse, '')
    //     console.log('CurrenciesResponse table = ' + mockTradingSchedulesResponseT);
    // });
   // it('generate enum field', async () => {
   //      //console.log('mockSecurityTradingStatus = ' + prettyJSON(mockSecurityTradingStatus));
   //
   //      let mockEnum = await create_enum_field('ShareType', RealExchange, '')
   //      console.log('CmockEnum = ' + mockEnum);
   // });
    // it('default', async () => {
    //     let schema = GenerateSchema.clickhouse(tableName, mockTradingSchedulesResponse);
    //     console.log('schema = ' + schema);
    // });
    afterEach(async () => {
        // TODO: заменил генератор кликхауза на свой
        //let schema = GenerateSchema.clickhouse(tableName, mock);
        //console.log('schema = ' + schema);
        // let sharesTable = await create_table(tableName, mock, '')
        // console.log('sharesTable = ' + sharesTable);
    })
});