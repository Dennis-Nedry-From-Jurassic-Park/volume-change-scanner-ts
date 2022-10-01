import {MoneyValue} from "tinkoff-invest-api/cjs/generated/common";
import moment from "moment";
import {Exchange} from "../../ms-base/src/constants/exchange";
import {api} from "../../ms-ti-base/api";
import {HttpService} from "@nestjs/axios";
import {PORT_CRON_ROBOT2} from "../../ms-base/src/app/ports";
import axios from "axios";
import {delay} from "../../ms-ti-base/wait";

export class TradingShedule {
    constructor(private readonly httpService: HttpService){}

    get_trading_shedules = async (
        exchanges: Exchange[] = [Exchange.SPB, Exchange.SPB_MORNING, Exchange.SPB_HK, Exchange.MOEX]
    ): Promise<any> => {
        const date = moment.now()
        const from = moment(date).subtract(0,'days').toDate()
        const to = moment(date).toDate()

        let trading_day_per_exchange = await api.instruments.tradingSchedules({
            exchange: Exchange.None,
            from: from,
            to: to
        })

        let jsonObject = {};

        for(const exchange of exchanges) {
            const e = trading_day_per_exchange.exchanges.filter((e:any) => { return e.exchange === exchange })[0].days[0];
            jsonObject[exchange] = { "date": e.date, "startTime": e.startTime, "endTime": e.endTime, "isTradingDay": e.isTradingDay };

            //console.log(e)

            if(e.isTradingDay){
                await delay(500)

                const url = `http://127.0.0.1:${PORT_CRON_ROBOT2}/cron/start/` + exchange;

                try {
                    axios({
                        method: "get",
                        url: url
                    });
                } catch(error){
                    console.log(error)
                }


                //await this.httpService.get(url)
            }
        }

        return jsonObject;
    }
}

export class TradingCalendar {

}

export const trading_shedule_service = new TradingShedule(new HttpService());


