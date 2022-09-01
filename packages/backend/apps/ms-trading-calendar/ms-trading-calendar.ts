import moment from "moment";
import assert from "assert";
import {TradingSchedule} from "tinkoff-invest-api/src/generated/instruments";
import {api} from "../ms-ti-base/api";
// https://stackoverflow.com/questions/36606153/get-previous-business-day-with-moment-js
export const moment_business_days = require('moment-business-days');


export const is_trading_day = async (exchange: string): Promise<boolean> => {
    const now = moment().toDate();

    const tradingDay = await api.instruments.tradingSchedules({
        exchange: exchange,
        from: now,
        to: now,
    });

    const exchanges = tradingDay.exchanges;

    assert(exchanges.length > 0, 'list of exchanges should be not empty');
    // TODO: в цикле обойти ?
    const days = exchanges.filter((tradingSchedule:TradingSchedule) => { return tradingSchedule.exchange === exchange })[0].days[0];

    //console.log(prettyJSON(tradingDay))

    return days.isTradingDay
}