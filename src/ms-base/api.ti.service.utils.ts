import secrets from '../utility-methods/env';
import moment from "moment";
import {Share} from "tinkoff-invest-api/cjs/generated/instruments";
import {SecurityTradingStatus} from "tinkoff-invest-api/cjs/generated/common";
import {Exchange} from "../constants/exchange";
import {DAY} from "../constants/date.time.formats";




export const get_gap_dates = async (dates:string[]): Promise<string[]> => {
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

  /*
  ММВБ – Индекс Мосбиржи (IMOEX)
13666
mcx-chart
   */


export const get_russian_shares = async (apiTradeAvailableFlag: boolean): Promise<Share[]> => {
    let shares: Share[] = require('../../temp/combined_shares.json').filter((share: Share) => {
        // return !share.otcFlag && share.exchange === 'MOEX'  460 акций

        return !share.otcFlag
            && (share.exchange === Exchange.MOEX || share.exchange === Exchange.MOEX_MORNING)
            && share.tradingStatus !== SecurityTradingStatus.SECURITY_TRADING_STATUS_NOT_AVAILABLE_FOR_TRADING
            && share.buyAvailableFlag
            && share.sellAvailableFlag
            //&& share.apiTradeAvailableFlag === apiTradeAvailableFlag

    });
    return shares
}






