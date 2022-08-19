
let GenerateSchema = require('generate-schema')
// https://github.com/nijikokun/generate-schema



let schema2 = GenerateSchema.clickhouse('shares',
    {
            "figi": "figi5f7ajg",
            "ticker": "ticker2714gd",
            "classCode": "classCode33h341",
            "isin": "isincha5hi",
            "lot": 4336.436349573991,
            "currency": "currencyb8284e",
            "shortEnabledFlag": true,
            "name": "name4902i3",
            "exchange": "exchangee1gij0",
            "issueSize": 8824.261393319375,
            "countryOfRisk": "countryOfRisk2f509a",
            "countryOfRiskName": "countryOfRiskName32ac91",
            "sector": "sectorgebb6a",
            "issueSizePlan": -1686.5740315816074,
            "tradingStatus": 3,
            "otcFlag": false,
            "buyAvailableFlag": true,
            "sellAvailableFlag": false,
            "divYieldFlag": false,
            "shareType": 7,
            "apiTradeAvailableFlag": false,
            "uid": "uidfg0063",
            "realExchange": 2
    }
);





let schema = GenerateSchema.clickhouse('shares',schema2)

console.log(schema)


/*

CREATE TABLE shares (  id String,  figi String,  ticker String,  classCode String,  isin String,  lot Int32,  currency String,  shortEnabledFlag String,  name String,  exchange String,  issueSize Int32,  countryOfRisk String,  co
untryOfRiskName String,  sector String,  issueSizePlan Int32,  tradingStatus Int32,  otcFlag String,  buyAvailableFlag String,  sellAvailableFlag String,  divYieldFlag String,  shareType Int32,  apiTradeAvailableFlag String,  uid
 String,  realExchange Int32) ENGINE = Memory;





 */








//import { mock, when, instance } from 'strong-mock';

//import { createMock } from 'ts-auto-mock';
import {RealExchange, Share, ShareType} from "tinkoff-invest-api/cjs/generated/instruments";
import SafeMock, {when, verify} from "safe-mock";
import {SecurityTradingStatus} from "tinkoff-invest-api/cjs/generated/common";
import {api} from "../../api.ti.common";

//const share = SafeMock.build<Share>();
//const share = {} as Share
//const share = <Share>{}
//const share: Share = {}

//const share = createMock<Share>();

// console.log(share)
// console.log(share.figi)





// import { createMock } from 'ts-auto-mock';
//
// interface Person {
//         id: string;
//         getName(): string;
//         details: {
//                 phone: number
//         }
// }
// const mock = createMock<Person>();







// const share = mock<Share>();
//console.log(instance(share).figi)
/*
CREATE TABLE shares (  id String,  figi String,  ticker String,  classCode String,  isin String,  lot Int32,  currency String,  shortEnabledFlag String,  name String,  exchange String,  ipoDate DateTime,  issueSize Int32,  countr
yOfRisk String,  countryOfRiskName String,  sector String,  issueSizePlan Int32,  tradingStatus Int32,  otcFlag String,  buyAvailableFlag String,  sellAvailableFlag String,  divYieldFlag String,  shareType Int32,  apiTradeAvailab
leFlag String,  uid String,  realExchange Int32) ENGINE = Memory;
CREATE TABLE shares_nominal (  shares_id String,  id String,  currency String,  units Int32,  nano Int32) ENGINE = Memory;
CREATE TABLE shares_minPriceIncrement (  shares_id String,  id String,  units Int32,  nano Int32) ENGINE = Memory;
 */
