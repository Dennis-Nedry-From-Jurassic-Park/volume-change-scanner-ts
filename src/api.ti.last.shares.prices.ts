import secrets from './utility-methods/env';

import {TinkoffInvestApi} from 'tinkoff-invest-api';
import {toNum} from "./ms-ti-base/number";
import {instrumentsService} from "./ms-ti-base/instruments.service";

const token = secrets.token!;

const api = new TinkoffInvestApi({ token: token });

export const get_last_shares_prices = async (tickers:string[]) => {

    //const pairs = get_pairs_ticker_figi()
    //api.marketdata.getLastPrices(({figi = }))
}

export const main = async () => {
    /*const tickers = [
        'PHOR',
        'POSI',
        'PLZL',
        'MTLRPq',
        'LKOH',
        'MGNT',
        'SBER',
        'SBERP',
        'YNDX',
        'TCSG',
        'VKCO',
        'MVID',
        'OZON',
        'POLY',
        'ALRS',
        'IRAO',
        'PIKK',
        'MTSS',
        'CHMF',
        'RASP',
        'NLMK',
        'AFKS',
        'FIVE',
        'GAZP',
        'ROSN',
        'NVTK',

    ];*/

    const tickers = [
        'BBBY',
        'EAR',
        'CLOV',
        'PLTR',
        'TSN',
        'DINO',
        'GEVO',
        'BLNK',
        'AZPN',
        'VLDR',
        'LAZR',
        'MARA',
        'MSTR',
        'AMZN',
        'AAPL',
        'DKNG',
        'PLUG',
        'DASH',
        'NET',
        'blue',
        ]

    const pairs = await instrumentsService.get_pairs_ticker_figi();
    //console.log(pairs)

    /*
    'NET',
        'DASH',
        'DKNG',
        'LYFT',
        'PLUG',
        'GTN',
        'DKNG',
        'ACMR'
     */

    const figies = pairs.filter( i => tickers.includes( i.ticker ) ).map( i => { return i.figi });
    //console.log(figies);

    // var filteredArray = pairs.filter(function(pair: Pair){
    //     return tickers.indexOf(pair.ticker) > -1;
    // });
    //
    //
    // var c = tickers.reduce(function(obj:any, key:any) {
    //     if (pairs.hasOwnProperty(key)) obj[key] = pairs[key];
    //     return obj;
    // }, {}); // {b: 2, c: 3}

    //console.log(figies)
    //const figies = pairs.filter()

    const lastPrices = await api.marketdata.getLastPrices(({figi: figies}));

    const merged = lastPrices.lastPrices.map( (obj:any) => {
        return {
            //...obj,
            //figi: obj.figi,
            ticker: pairs.filter( i => { return i.figi === obj.figi } )[0].ticker,
            price: toNum(obj.price)
        }
    });
    console.log(lastPrices.lastPrices[0].time)
    console.log(merged)

    //const lastPricesBBG0013HGFT4 = await api.marketdata.getLastPrices(({figi: ['BBG0013HGFT4']}));
    //console.log(prettyJSON(lastPricesBBG0013HGFT4));


}


main();
