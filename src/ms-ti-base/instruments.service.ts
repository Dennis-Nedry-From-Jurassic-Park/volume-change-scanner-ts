import {InstrumentStatus} from "tinkoff-invest-api/cjs/generated/instruments";
import {Share} from "tinkoff-invest-api/cjs/generated/instruments";
import {Exchange} from "../constants/exchange";
import {SecurityTradingStatus} from "tinkoff-invest-api/cjs/generated/common";
import {delay} from "./wait";
import moment from "moment";
import {DAY} from "../constants/date.time.formats";

export interface Pair {
    ticker: string,
    figi: string
}

interface Instruments {
    instruments: Share[]
}

type IMOEX = Exchange.MOEX | Exchange.MOEX_MORNING

class InstrumentsService {
    private readonly status: InstrumentStatus;
    private readonly isQualifiedInvestor: boolean;
    private readonly otcFlag: boolean;
    private shares: Share[] = [];
    private instruments: Instruments = { instruments: [] };
    private readonly imoex_exchanges: Exchange[] = [];

    constructor(
        status: InstrumentStatus = InstrumentStatus.INSTRUMENT_STATUS_BASE,
        isQualifiedInvestor: boolean = false
    ) {
        this.status = status;
        this.isQualifiedInvestor = isQualifiedInvestor;
        this.otcFlag = this.isQualifiedInvestor;

        this.imoex_exchanges = [Exchange.MOEX, Exchange.MOEX_MORNING, Exchange.MOEX_WEEKEND];

        const shares_file_name =
                this.status === InstrumentStatus.INSTRUMENT_STATUS_BASE ?  './shares_status_base.json' : './shares_status_all.json';

        this.shares = require(shares_file_name).instruments.filter((share: Share) => share.otcFlag === this.otcFlag );

        this.instruments = require(shares_file_name);
    }

    get_figies_by_tickers = async (tickers: string[]): Promise<string[]> => {
        return this.shares.filter((share:Share) => {
            return share.otcFlag === this.otcFlag && tickers.includes(share.ticker)
        }).map( (share:Share) => { return share.figi });
    }



    get_figies_by_tickers_with_filter = async (
        tickers?: string[],
        exchanges?: Exchange[],
        buyAvailableFlag?: boolean,
        sellAvailableFlag?: boolean,
        apiTradeAvailableFlag?: boolean,
    ): Promise<string[]> =>{
        return (await this.get_shares_by_tickers_with_filter(
            tickers, exchanges, buyAvailableFlag, sellAvailableFlag, apiTradeAvailableFlag
        )).map((share: Share) => {
            return share.figi
        });
    }

    // get_russian_shares = async (
    //     tickers: string[],
    //     buyAvailableFlag: boolean = true,
    //     sellAvailableFlag: boolean = true,
    //     apiTradeAvailableFlag: boolean = true,
    //     exchanges: Exchange[] = [Exchange.MOEX, Exchange.MOEX_MORNING]
    // ): Promise<Share[]> => {
    //     return await this.get_shares_by_tickers_with_filter(tickers, exchanges, buyAvailableFlag, sellAvailableFlag);
    // }

    get_russian_shares = async (
        tickers?: string[],
        exchanges: Exchange[] = [Exchange.MOEX, Exchange.MOEX_MORNING],
        buyAvailableFlag: boolean = true,
        sellAvailableFlag: boolean = true,
        apiTradeAvailableFlag: boolean = true,
    ): Promise<Share[]> => {
        return await this._get_russian_shares(
            tickers,
            exchanges,
            buyAvailableFlag,
            sellAvailableFlag,
            apiTradeAvailableFlag,
        )
    }



    get_all_russian_shares = async(): Promise<Share[]> => {
        return await this._get_russian_shares(
            undefined,
            this.imoex_exchanges,
            undefined,
            undefined,
            undefined
        )
    }
    get_all_american_shares = async(): Promise<Share[]> => {
        return await this._get_russian_shares(
            undefined,
            [Exchange.SPB],
            undefined,
            undefined,
            undefined
        )
    }

    private _get_russian_shares = async (
        tickers?: string[],
        exchanges?: Exchange[],
        buyAvailableFlag?: boolean,
        sellAvailableFlag?: boolean,
        apiTradeAvailableFlag?: boolean,

    ): Promise<Share[]> => {
        return await this.get_shares_by_tickers_with_filter(tickers, exchanges, buyAvailableFlag, sellAvailableFlag, apiTradeAvailableFlag);
    }

    get_american_shares_ = async (
        tickers: string[],
        exchanges: Exchange[] = [Exchange.SPB],
        buyAvailableFlag: boolean,
        sellAvailableFlag: boolean,
        apiTradeAvailableFlag?: boolean,
    ): Promise<Share[]> => {
        return await this.get_shares_by_tickers_with_filter(tickers, exchanges, buyAvailableFlag, sellAvailableFlag);
    }



    get_shares_by_tickers_with_filter = async (
        tickers?: string[],
        exchanges?: Exchange[],
        buyAvailableFlag?: boolean,
        sellAvailableFlag?: boolean,
        apiTradeAvailableFlag?: boolean,
    ): Promise<Share[]> => {
        let values = exchanges!.filter((item) => {
            return isNaN(Number(item));
        }).map(it => it.toString());

        return this.shares.filter((share: Share) => {


            //console.log(values)
            //console.log(share.exchange)


            //console.log(Exchange[share.exchange])
            //console.log(values!.includes(Exchange[share.exchange]))
            //console.log(values!.includes(share.exchange))
            //const bool1 = exchanges !== undefined ? (exchanges!.includes(Exchange[share.exchange])) : true
            //const bool1 = exchanges !== undefined ? (values!.includes(share.exchange)) : true
            const bool1 = exchanges !== undefined ? (values!.includes(share.exchange)) : true
            //console.log(values!.includes(share.exchange))
            //console.log(bool1)
            const bool_tickers_flag = tickers !== undefined ? tickers.includes(share.ticker) : true

            return buyAvailableFlag !== undefined ? share.buyAvailableFlag === buyAvailableFlag : true
                && sellAvailableFlag !== undefined ? share.sellAvailableFlag === sellAvailableFlag : true
                && apiTradeAvailableFlag !== undefined ? share.apiTradeAvailableFlag === apiTradeAvailableFlag : true

                && bool_tickers_flag && bool1

                && share.otcFlag === this.otcFlag
                && share.tradingStatus !== SecurityTradingStatus.SECURITY_TRADING_STATUS_NOT_AVAILABLE_FOR_TRADING

        })
    }

    _get_pairs_ticker_figi = async (tickers: string[]): Promise<Pair[]> => {

        return this.shares.filter((share:Share) => {
            return tickers.includes(share.ticker)//  && share.otcFlag === this.otcFlag && share.tradingStatus !== SecurityTradingStatus.SECURITY_TRADING_STATUS_NOT_AVAILABLE_FOR_TRADING
        }).map((s:Share) => { return { ticker: s.ticker, figi: s.figi }});
    }

    get_pairs_ticker_figi = async (exchanges?: Exchange[]): Promise<Pair[]> => {
        let values = exchanges!.filter((item) => {
            return isNaN(Number(item));
        }).map(it => it.toString());


        return this.shares.filter((share:Share) => {
            const bool1 = exchanges !== undefined ? (values!.includes(share.exchange)) : true
            return bool1 && share.otcFlag === this.otcFlag && share.tradingStatus !== SecurityTradingStatus.SECURITY_TRADING_STATUS_NOT_AVAILABLE_FOR_TRADING
        }).map((s:Share) => { return { ticker: s.ticker, figi: s.figi }});
    }

    get_tickers = async (): Promise<string[]> => {
        return this.shares.map( (s:Share) => { return s.ticker });
    }



    get_instrument_by_ticker = async (ticker:string): Promise<Share> => {
        return this.instruments.instruments.filter((s:Share) => { return s.ticker === ticker })[0];
    } // возможно обобщённый метод и для валюты подойдёт

    get_share_by_isin = async (isin:string): Promise<Share> => {
        return this.shares.filter( (s:Share) => { return s.isin === isin })[0];
    }

    get_share_by_ticker = async (ticker:string): Promise<Share> => {
        return this.shares.filter( (s:Share) => { return s.ticker === ticker })[0];
    }

    get_share_by_figi = async (figi:string): Promise<Share> => {
        return this.shares.filter( (s:Share) => { return s.figi === figi })[0];
    }
    get_share_by_figi_ = (figi:string): Share => {
        return this.shares.filter( (s:Share) => { return s.figi === figi })[0];
    }

    get_gap_dates = async (dates:string[]): Promise<string[]> => {
        let gap_dates: any[] = [];

        for(let i = 0; i<dates.length-1;i++){
            let startDate = moment(dates[i]).add(1, 'day');
            let endDate = moment(dates[i+1]);

            for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
                gap_dates.push(m.format(DAY));
            }
        }

        // console.log(gap_dates)

        return gap_dates;
    }
}

export const instrumentsService = new InstrumentsService();

