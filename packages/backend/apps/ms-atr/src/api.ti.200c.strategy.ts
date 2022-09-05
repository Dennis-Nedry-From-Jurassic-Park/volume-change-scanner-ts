import {LastPrice} from "tinkoff-invest-api/dist/generated/marketdata";
import {asyncWriteFile} from "../../ms-base/src/utility-methods/file";
import moment from "moment";
import {DAY} from "../../ms-base/src/constants/date.time.formats";
import {toNum} from "../../ms-ti-base/number";
import {instrumentsService, Pair} from "../../ms-ti-base/instruments.service";
import {api} from "../../ms-ti-base/api";
import {prettyJSON} from "../../ms-ti-base/output";

const tickers = [
    "AA",
    "AAPL",
    "ABBV",
    "ABNB",
    "ABT",
    "ACAD",
    "ADBE",
    "ADSK",
    "AFRM",
    "AKAM",
    "ALB",
    "AMAT",
    "AMD",
    "AMZN",
    "APA",
    "APPS",
    "ATUS",
    "ATVI",
    "AVGO",
    "AXP",
    "BA",
    "BABA",
    "BBY",
    "BIDU",
    "BKR",
    "BLK",
    "BMY",
    "BZUN",
    "C",
    "CAT",
    "CCL",
    "CCXI",
    "CF",
    "CHGG",
    "CL",
    "CLF",
    "CNK",
    "COP",
    "CPNG",
    "CRM",
    "CROX",
    "CRWD",
    "CSCO",
    "CVS",
    "CVX",
    "DAL",
    "DD",
    "DE",
    "DG",
    "DHI",
    "DHR",
    "DIS",
    "DISH",
    "DLTR",
    "DOCU",
    "DVN",
    "EBAY",
    "ECL",
    "ENPH",
    "EOG",
    "EQT",
    "ETRN",
    "ETSY",
    "F",
    "FATE",
    "FBHS",
    "FCX",
    "FDX",
    "FSLR",
    "FTCH",
    "FTI",
    "FTV",
    "GILD",
    "GIS",
    "GM",
    "GOLD",
    "GOOGL",
    "GPS",
    "GS",
    "GT",
    "HAL",
    "HBI",
    "HD",
    "HRL",
    "IBM",
    "ICE",
    "INTC",
    "IOVA",
    "JD",
    "JNJ",
    "JPM",
    "KHC",
    "KMB",
    "KO",
    "LEN",
    "LEVI",
    "LI",
    "LLY",
    "LMT",
    "LRCX",
    "LTHM",
    "LUMN",
    "LUV",
    "LVS",
    "LYFT",
    "M",
    "MA",
    "MAC",
    "MCD",
    "MCK",
    "MDB",
    "MO",
    "MOS",
    "MPC",
    "MRK",
    "MRNA",
    "MRO",
    "MS",
    "MSFT",
    "MU",
    "NEE",
    "NEM",
    "NET",
    "NFLX",
    "NKE",
    "NOW",
    "NRG",
    "NTES",
    "NVDA",
    "OKE",
    "OKTA",
    "ON",
    "ORCL",
    "OVV",
    "OXY",
    "PARA",
    "PBF",
    "PEP",
    "PFE",
    "PG",
    "PHM",
    "PLAY",
    "PLTR",
    "PM",
    "PSTG",
    "PTON",
    "QCOM",
    "RCL",
    "ROKU",
    "RRC",
    "RUN",
    "SBUX",
    "SCHW",
    "SHEL",
    "SHOP",
    "SIG",
    "SLB",
    "SNAP",
    "SNOW",
    "SPOT",
    "SPR",
    "SQ",

    "SWK",

    "T",

    "TDOC",

    "TGT",

    "TRIP",

    "TSLA",

    "TSM",

    "TSN",

    "TTD",

    "TTE",

    "TWLO",

    "TWOU",

    "TWTR",

    "TXG",

    "UAA",

    "UAL",
    "UBER",
    "UNH",
    "V",
    "VALE",

    "VIPS",

    "VLO",

    "VRTX",

    "VZ",

    "WB",

    "WBD",

    "WDC",

    "WFC",

    "WMB",

    "WMT",

    "WYNN",
    "XOM",
    "XRAY",
    "XRX",
    "Z",
    "ZIM",
    "ZM",
    "ZS",
    "AA",
    "AAPL",
    "ABBV",
    "ABNB",
    "ABT",
    "ACAD",
    "ADBE",
    "ADSK",
    "AFRM",

    "AKAM",
    "ALB",
    "AMAT",
    "AMD",
    "AMZN",
    "APA",
    "APPS",
    "ATUS",
    "ATVI",
    "AVGO",
    "AXP",
    "BA",
    "BABA",
    "BBY",
    "BIDU",
    "BKR",

    "BLK",

    "BMY",

    "BZUN",
    "C",
    "CAT",
    "CCL",
    "CCXI",
    "CF",
    "CHGG",
    "CL",
    "CLF",
    "CNK",
    "COP",
    "CPNG",
    "CRM",
    "CROX",
    "CRWD",
    "CSCO",
    "CVS",
    "CVX",
    "DAL",

    "DD",

    "DE",

    "DG",

    "DHI",

    "DHR",

    "DIS",

    "DISH",

    "DLTR",

    "DOCU",

    "DVN",

    "EBAY",
    "ECL",
    "ENPH",
    "EOG",
    "EQT",
    "ETRN",
    "ETSY",
    "F",

    "FATE",

    "FBHS",

    "FCX",

    "FDX",

    "FSLR",

    "FTCH",
    "FTI",
    "FTV",
    "GILD",
    "GIS",
    "GM",
    "GOLD",
    "GOOGL",
    "GPS",
    "GS",
    "GT",
    "HAL",
    "HBI",
    "HD",
    "HRL",
    "IBM",
    "ICE",
    "INTC",
    "IOVA",
    "JD",
    "JNJ",
    "JPM",
    "KHC",
    "KMB",
    "KO",
    "LEN",
    "LEVI",
    "LI",
    "LLY",
    "LMT",
    "LRCX",
    "LTHM",
    "LUMN",
    "LUV",
    "LVS",
    "LYFT",
    "M",
    "MA",
    "MAC",
    "MCD",
    "MCK",
    "MDB",
    "MO",
    "MOS",
    "MPC",
    "MRK",
    "MRNA",
    "MRO",
    "MS",
    "MSFT",
    "MU",
    "NEE",
    "NEM",
    "NET",
    "NFLX",
    "NKE",
    "NOW",
    "NRG",
    "NTES",
    "NVDA",
    "OKE",
    "OKTA",
    "ON",
    "ORCL",
    "OVV",
    "OXY",
    "PARA",
    "PBF",
    "PEP",
    "PFE",
    "PG",
    "PHM",
    "PLAY",
    "PLTR",
    "PM",
    "PSTG",
    "PTON",
    "QCOM",
    "RCL",
    "ROKU",
    "RRC",
    "RUN",
    "SBUX",
    "SCHW",
    "SHEL",
    "SHOP",
    "SIG",
    "SLB",
    "SNAP",
    "SNOW",
    "SPOT",
    "SPR",
    "SQ",
    "SWK",
    "T",
    "TDOC",
    "TGT",
    "TRIP",
    "TSLA",
    "TSM",
    "TSN",
    "TTD",
    "TTE",
    "TWLO",
    "TWOU",
    "TWTR",
    "TXG",
    "UAA",
    "UAL",
    "UBER",
    "UNH",
    "V",
    "VALE",
    "VIPS",
    "VLO",
    "VRTX",
    "VZ",
    "WB",
    "WBD",
    "WDC",
    "WFC",
    "WMB",
    "WMT",
    "WYNN",
    "XOM",
    "XRAY",
    "XRX",
    "Z",
    "ZIM",
    "ZM",
    "ZS",
]


type TickerPrice = {
    ticker: string,
    price: number,
}

const get_ticker = (pairs: Pair[], figi: string): string => {
    return pairs.filter( i => { return i.figi === figi } )[0].ticker
}

const isLastPrice = (item: LastPrice | undefined): item is LastPrice => {
    return !!item
}


const get_last_prices = async () => {
    const histTickerPrice: TickerPrice[]  = require('./strategy/spbe-200-companies/companies.under.200$.2022-08-12.json');
    //console.log(histTickerPrice);

    const figies = await instrumentsService.get_figies_by_tickers(tickers);
    //console.log(figies)
    const lastPrices = await api.marketdata.getLastPrices({ figi: figies })
    const filtered_under_50$ = lastPrices.lastPrices;

    const pairs = await instrumentsService.get_pairs_ticker_figi();

    let merged = lastPrices.lastPrices
        .filter( (lastPrice:LastPrice) => {
            return figies.includes(lastPrice.figi) && (lastPrice.price != undefined || lastPrice.price != null) && toNum(lastPrice.price!)! <= 199.99
        })
        //.filter( (share:LastPrice) => { return toNum(share.price!)! >= 50 && toNum(share.price!)! <= 199.99 }) // 8% per deal
        //.filter( (share:LastPrice) => { return typeof(share.price) !== 'undefined' || share.price !== undefined || share.price != undefined || share.price !== null }) // 8% per deal
        // 8% per deal
        //.filter( (share:LastPrice) => { return isLastPrice(share) }) // 8% per deal
        .map( (lastPrice:LastPrice) => {
            //console.log('ticker: '+ get_ticker(pairs, lastPrice.figi))
            const ticker = get_ticker(pairs, lastPrice.figi);
            const prev = histTickerPrice.filter((obj: any) => { return obj.ticker === ticker})[0].price;
            const curr = toNum(lastPrice.price)!;

            return {
                //...obj,
                ticker: ticker,
                //ticker: pairs.filter( i => { return i.figi === lastPrice.figi } )[0].ticker,
                prev_price: prev,
                price: curr,
                change: (curr / prev - 1) * 100
            }
        });
    //merged.sort( (a:any,b:any) => toNum(b.price!)! - toNum(a.price!)!)
    merged.sort( (a:any,b:any) => b.change - a.change )


    console.log(moment().toISOString())
    //console.table(merged.filter( (obj:any) => { return obj.change !== 0 }))
    console.table(merged.filter( (obj:any) => { return obj.change >= 2.5 || obj.change <= -2.5 }))


}
// TODO: get_last_prices();






const save_russian_tickers = async () => {
    const rus_pairs = []// TODO await instrumentsService.get_pairs_ticker_figi_wi_condition(true);
    console.log(rus_pairs.length)
    const figies = rus_pairs.map((obj:any) => { return obj.figi })
    const lastPrices = await api.marketdata.getLastPrices({ figi: figies })

    console.log(moment().toISOString())
    //console.table(merged.filter( (obj:any) => { return obj.change !== 0 }))

    let merged = lastPrices.lastPrices
        .map( (lastPrice:LastPrice) => {
            return {
                ticker: "",// TODO: rus_pairs.filter( i => { return i.figi === lastPrice.figi } )[0].ticker,
                price: toNum(lastPrice.price)
            }
        });

    console.table(merged)
}

//save_russian_tickers();

const exec_usa_200c = async () => {
    const figies = await instrumentsService.get_figies_by_tickers(tickers);
    //console.log(figies)
    const lastPrices = await api.marketdata.getLastPrices({ figi: figies })
    const filtered_under_50$ = lastPrices.lastPrices;

    const pairs = await instrumentsService.get_pairs_ticker_figi();
    let merged = lastPrices.lastPrices
        //.filter( (share:LastPrice) => { return toNum(share.price!)! >= 50 && toNum(share.price!)! <= 199.99 }) // 8% per deal
        .filter( (share:LastPrice) => { return toNum(share.price!)! <= 199.99 }) // 8% per deal
        .map( (lastPrice:LastPrice) => {
            return {
                //...obj,
                ticker: pairs.filter( i => { return i.figi === lastPrice.figi } )[0].ticker,
                price: toNum(lastPrice.price)
            }
         });
    merged.sort( (a:any,b:any) => toNum(b.price!)! - toNum(a.price!)!)



    console.log(merged)

    //const util = require('util')

        //const inspect = util.inspect(merged, {showHidden: false, depth: null, colors: true})

    //console.log(inspect)



    const day = moment().format(DAY)

    asyncWriteFile('../../companies.under.200$.' + day + '.json', prettyJSON(merged))
}
//exec_usa_200c();






const exec_rus_500c = async () => {
    const rus_pairs = []// TODO: await get_pairs_ticker_figi_wi_condition(true);
    console.log(rus_pairs.length)
    const figies = rus_pairs.map((obj:any) => { return obj.figi })
    const lastPrices = await api.marketdata.getLastPrices({ figi: figies })

    let merged = lastPrices.lastPrices
        //.filter( (share:LastPrice) => { return toNum(share.price!)! >= 50 && toNum(share.price!)! <= 199.99 }) // 8% per deal
        .filter( (share:LastPrice) => { return toNum(share.price!)! <= 16000 }) // 8% per deal
        .map( (lastPrice:LastPrice) => {
            return {
                //...obj,
                ticker: '',// rus_pairs.filter( i => { return i.figi === lastPrice.figi } )[0].ticker,
                price: toNum(lastPrice.price)
            }
        });
    merged.sort( (a:any,b:any) => toNum(b.price!)! - toNum(a.price!)!)



    console.log(merged)

    //const util = require('util')

    //const inspect = util.inspect(merged, {showHidden: false, depth: null, colors: true})

    //console.log(inspect)



    const day = moment().format(DAY)

    //asyncWriteFile('../../rus.companies.' + day + '.json', prettyJSON(merged))
}
//exec_rus_500c();



const get_last_prices_GDR_rus_shares = async () => {
    const histTickerPrice: TickerPrice[]  = require('./strategy/russian-change-prev-day/rus.companies.2022-08-15.json');

    const tickers = [
        'GMKN',
        'NMTP',
        'SNGSP',
        'SNGS',
        'AFKS',
        'LSRG',
        'CHMF',
        'VTBR',
        'PHOR',
        'FEES',
        'SBER',
        'SBERP',
        'HYDR',
        'PIKK',
        'NLMK',
        'NVTK',
        'LKOH',
        'MGNT',
        'GAZP',
        'RTKM',
        'POSI',
        'ROSN',
        'PLZL',
        'RSTI',
        'RSTIP',
        'TATN',
        'MTSS',
        'TATNP',
    ]

    const figies = [] //await instrumentsService.get_rus_figies_by_tickers(tickers)
    const lastPrices = await api.marketdata.getLastPrices({ figi: figies })

    const pairs = await instrumentsService.get_pairs_ticker_figi();

    let merged = lastPrices.lastPrices
        //.filter( (share:LastPrice) => { return toNum(share.price!)! >= 50 && toNum(share.price!)! <= 199.99 }) // 8% per deal
        //.filter( (share:LastPrice) => { return typeof(share.price) !== 'undefined' || share.price !== undefined || share.price != undefined || share.price !== null }) // 8% per deal
        // 8% per deal
        .filter( (share:LastPrice) => { return (share.price != undefined || share.price != null) && toNum(share.price!)! <= 16000.99 }) // 8% per deal
        //.filter( (share:LastPrice) => { return isLastPrice(share) }) // 8% per deal
        .map( (lastPrice:LastPrice) => {
            //console.log('ticker: '+ get_ticker(pairs, lastPrice.figi))
            const ticker = get_ticker(pairs, lastPrice.figi);
            const prev = histTickerPrice.filter((obj: any) => { return obj.ticker === ticker})[0].price;
            const curr = toNum(lastPrice.price)!;

            return {
                ticker: ticker,
                prev_price: prev,
                price: curr,
                change: (curr / prev - 1) * 100
            }
        });
    //merged.sort( (a:any,b:any) => toNum(b.price!)! - toNum(a.price!)!)
    merged.sort( (a:any,b:any) => b.change - a.change )


    console.log(moment().toISOString())
    //console.table(merged.filter( (obj:any) => { return obj.change !== 0 }))
    console.table(merged.filter( (obj:any) => { return obj.change >= 2.22 || obj.change <= -2.22 }))
}

const get_last_prices_rus_shares = async () => {
    const histTickerPrice: TickerPrice[]  = require('./strategy/russian-change-prev-day/rus.companies.2022-08-15.json');
    const rus_pairs = []//await get_pairs_ticker_figi_wi_condition(true);
    const figies = rus_pairs.map((obj:any) => { return obj.figi })
    const lastPrices = await api.marketdata.getLastPrices({ figi: figies })

    const pairs = await instrumentsService.get_pairs_ticker_figi();

    let merged = lastPrices.lastPrices
        //.filter( (share:LastPrice) => { return toNum(share.price!)! >= 50 && toNum(share.price!)! <= 199.99 }) // 8% per deal
        //.filter( (share:LastPrice) => { return typeof(share.price) !== 'undefined' || share.price !== undefined || share.price != undefined || share.price !== null }) // 8% per deal
        // 8% per deal
        .filter( (share:LastPrice) => { return (share.price != undefined || share.price != null) && toNum(share.price!)! <= 16000.99 }) // 8% per deal
        //.filter( (share:LastPrice) => { return isLastPrice(share) }) // 8% per deal
        .map( (lastPrice:LastPrice) => {
            //console.log('ticker: '+ get_ticker(pairs, lastPrice.figi))
            const ticker = get_ticker(pairs, lastPrice.figi);
            const prev = histTickerPrice.filter((obj: any) => { return obj.ticker === ticker})[0].price;
            const curr = toNum(lastPrice.price)!;

            return {
                ticker: ticker,
                prev_price: prev,
                price: curr,
                change: (curr / prev - 1) * 100
            }
        });
    //merged.sort( (a:any,b:any) => toNum(b.price!)! - toNum(a.price!)!)
    merged.sort( (a:any,b:any) => b.change - a.change )


    console.log(moment().toISOString())
    //console.table(merged.filter( (obj:any) => { return obj.change !== 0 }))
    console.table(merged.filter( (obj:any) => { return obj.change >= 2.22 || obj.change <= -2.22 }))
}


get_last_prices_GDR_rus_shares();
get_last_prices_rus_shares();
get_last_prices();
//exec_investing_robot();