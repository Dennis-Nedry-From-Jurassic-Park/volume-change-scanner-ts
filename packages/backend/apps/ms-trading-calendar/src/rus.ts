import {api} from "../../ms-ti-base/api";
import moment from "moment";
import {prettyJSON} from "../../ms-ti-base/output";
import {delay} from "../../ms-ti-base/wait";

let Holidays = require('date-holidays')
let hd = new Holidays()

const exchanges = async () => {

}

const exec = async () => {
    let map = new Map();

    const date = moment.now()
    const from = moment(date).subtract(0,'days').toDate()
    const to = moment(date).toDate()

    let trading_day_per_exchange = await api.instruments.tradingSchedules({
        exchange: '',
        from: from,
        to: to
    })
    console.log(trading_day_per_exchange)
//
//     Object.keys(trading_day_per_exchange.exchanges).forEach(function(itm){
//         if(itm === "SPB" || itm === "MOEX" || itm === "MOEX"){} else {
//             delete trading_day_per_exchange.exchanges[itm]
//         }
//     });
//
//     console.log(prettyJSON(trading_day_per_exchange))
// await delay(6000000)

    const exchanges = ['SPB', 'MOEX', 'SPB_HK'];


   // const {regex: _, ...newObj} = trading_day_per_exchange;

    let jsonObject = {};
    for(const exchange of exchanges) {
        const e = trading_day_per_exchange.exchanges.filter((e:any) => { return e.exchange === exchange})[0].days[0];
        jsonObject[exchange] = { "date": e.date, "startTime": e.startTime, "endTime": e.endTime, "isTradingDay": e.isTradingDay };
        //console.log(`${exchange} = `+e.isTradingDay);
        map.set(exchange, { "date": e.date, "startTime": e.startTime, "endTime": e.endTime, "isTradingDay": e.isTradingDay });

    }
   // console.log(map)
    console.log(jsonObject)

    // map.forEach((value, key) => {
    //     jsonObject[key] = value
    // });
    // console.log(prettyJSON(jsonObject))
    // return jsonObject;


    // console.log(prettyJSON(trading_day_per_exchange.exchanges.filter((e:any) => { return e.exchange === exchange})[0].days[0].startTime))
    // console.log(prettyJSON(trading_day_per_exchange.exchanges.filter((e:any) => { return e.exchange === exchange})[0].days[0].endTime))
    // console.log(prettyJSON(trading_day_per_exchange.exchanges.filter((e:any) => { return e.exchange === exchange})[0].days[0].date))
    // console.log(prettyJSON(trading_day_per_exchange.exchanges.filter((e:any) => { return e.exchange === exchange})[0].days[0].isTradingDay))
    // console.log(prettyJSON(trading_day_per_exchange))

}
const exec8 = async () => {
    hd = new Holidays('RU');

    const all = hd.getHolidays(2022);
    console.log(all)
}

exec();