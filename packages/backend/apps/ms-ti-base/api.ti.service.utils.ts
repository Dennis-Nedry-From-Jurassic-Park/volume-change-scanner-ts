import {Share} from "tinkoff-invest-api/cjs/generated/instruments";
import {SecurityTradingStatus} from "tinkoff-invest-api/cjs/generated/common";
import {Exchange} from "../ms-base/src/constants/exchange";


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






