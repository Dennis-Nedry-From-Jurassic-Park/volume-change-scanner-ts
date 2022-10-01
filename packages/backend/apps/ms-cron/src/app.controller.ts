import {Controller, Get, Header, Inject} from '@nestjs/common';
import {prettyJSON} from "../../ms-ti-base/output";
import {health} from "./tasks/tasks.constants";
import {ApiBearerAuth} from "@nestjs/swagger";
import {HttpService} from "@nestjs/axios";
import {map} from "rxjs";
import moment from "moment";
import {logger_cron} from "../../ms-base/src/logger/logger";
import {Exchange} from "../../ms-base/src/constants/exchange";
import {prepare_candles} from "../../ms-change-price-strategy/src/prepare-candles";
import {tickers} from "../../ms-ti-base/tickers";
import {prepare_candles_moex_exchange} from "../../ms-change-price-strategy/src/prepare-candles-moex-exchange";
import {SCHEDULE_SERVICE, ScheduleService} from "./app.service";
import {TradingScheduleModule} from "./app.module";
import {SchedulerRegistry} from "@nestjs/schedule";
import {jsonShedule} from "./s";
//import {Schedule} from "nest-schedule/index";
//import {exec_portfolio_balance_update} from "./portfolio.service";

export const prepare_trading_day_shedules = (shedules: JSON) => {
    Object.keys(shedules).forEach(function(exchange){
        if(shedules[exchange].isTradingDay){
            console.log('added cron job with name ' + exchange)
            console.log(exchange + ' - ' + shedules[exchange]);

            if(exchange === Exchange.MOEX) {
                const job_name = 'prepare_candles_for_'+exchange+'_exchange';
                this.create_timeout_job(job_name, 0, () => {
                    prepare_candles_moex_exchange_().then(() => console.log(`executed timeout job ` + job_name));
                    return false;
                })
            } else if(exchange === Exchange.SPB_MORNING){
                // const job_name = 'prepare_candles_for_'+exchange+'_exchange';
                // this.create_timeout_job(job_name, 0, () => {
                //     prepare_candles_spbe_exchange_morning_session_().then(r => console.log(`executed timeout job ` + job_name));
                //     return false;
                // })
            }
        } else {
            console.log(222)
            console.log(shedules[exchange].isTradingDay)
        }

    });
}

export const prepare_candles_moex_exchange_ = async () => {
    const job = 'prepare_candles_moex_exchange';
    const msg = `${moment().format('HH:mm:ss')} Job ${job} has been completed`;
    await health.set(job, 'runned');
    prepare_candles_moex_exchange()
        .then(() => {
            console.log(msg);
            logger_cron.log('debug', msg);
            health.set(job, 'done');
        })
        .catch(err => {
            console.log(err);
            logger_cron.error(err);
            health.set(job, 'fail');
        });
}

export const prepare_candles_spbe_exchange_morning_session_ = async () => {
    const job = 'prepare_candles_spbe_exchange_morning_session';
    const msg = `${moment().format('HH:mm:ss')} Job ${job} has been completed`;
    prepare_candles(tickers)
        .then(() => {
            console.log(msg);
            logger_cron.log('debug', msg);
            health.set(job, 'done');
        })
        .catch(err => {
            console.log(err);
            logger_cron.error(err);
            health.set(job, 'fail');
        });
}


function getScheduleService() {

}

@Controller('cron')
@ApiBearerAuth('token')
export class ScheduleController {

    constructor(
        private readonly httpService: HttpService,
        @Inject(SCHEDULE_SERVICE)
        public scheduleService: ScheduleService,
        //public schedulerRegistry: SchedulerRegistry,

    ) {
        // this.scheduleService = new ScheduleService(new Schedule())
        // SchedulerRegistry
        // function getScheduleService(): ScheduleService {
        //     return this.scheduleService
        // }
    }



    @Get('/exec-portfolio-balance-update')
    async exec_portfolio_balance_update() {
        //return await exec_portfolio_balance_update();
    }
    @Get('/health')
    @Header('content-type', 'application/json')
    async get_health() {
        const obj = await health.get_health();
        return obj// JSON.stringify(obj)
        //JSON.parse(prettyJSON(health.get_health()));
    }

    @Get('/trading-shedule/today')
    @Header('content-type', 'application/json')
    async get_trading_shedule() {
        // return this.httpService.get('https://api.github.com/users/quen2404')
        //     .pipe(map(response => response.data));
        //
        //
        // return this.httpService.get('https://api.github.com/users/quen2404')
        //     .toPromise()
        //     .then(res => res.data)
        //     .catch(err => /*handle error*/)




// return this.httpService.get('http://0.0.0.0:9202/trading-shedule/today').pipe(
//     map(response => JSON.parse(prettyJSON(response.data)))
// );
//         type x = { e?: { date: string, startTime: string, endTime: string, isTradingDay: string }}
//        // let json: any = {};
//         const json = this.httpService.get('http://0.0.0.0:9202/trading-shedule/today').pipe(
//
//             map(response => {
//                 return JSON.parse(prettyJSON(response.data))
//             })
//         );
//
//         console.log(json)
//         console.log(json['MOEX'])
//
//         return json['MOEX']


        const response: any = await this.httpService.get('http://0.0.0.0:9202/trading-shedule/today').toPromise();
        const shedules = JSON.parse(prettyJSON(response.data));

        jsonShedule.set(shedules)




        //prepare_trading_day_shedules(shedules);


        Object.keys(shedules).forEach(function(exchange){
            if(shedules[exchange].isTradingDay){
                console.log('added cron job with name ' + exchange)
                console.log(exchange + ' - ' + shedules[exchange]);

                if(exchange === Exchange.MOEX) {
                    const job_name = 'prepare_candles_for_'+exchange+'_exchange';

                    //this.scheduleService.add_job(job_name);
                    //this.scheduleService.run_job(job_name);

                        // .create_timeout_job(job_name, 0, () => {
                        // prepare_candles_moex_exchange_().then(() => console.log(`executed timeout job ` + job_name));
                        // return false;

                } else if(exchange === Exchange.SPB_MORNING){
                    // const job_name = 'prepare_candles_for_'+exchange+'_exchange';
                    // this.create_timeout_job(job_name, 0, () => {
                    //     prepare_candles_spbe_exchange_morning_session_().then(r => console.log(`executed timeout job ` + job_name));
                    //     return false;
                    // })
                }
            } else {
                console.log(222)
                console.log(shedules[exchange].isTradingDay)
            }

        });


        return shedules//{ e: json['MOEX'] }


        // let resp: any = ''
        // await this.httpService.get('http://0.0.0.0:9202/trading-shedule/today')
        //     .subscribe((response) => {
        //         //console.log(response);
        //         //console.log(response.data)
        //         console.log(response.data)
        //         console.log(111)
        //         const json = JSON.parse(prettyJSON(response.data))
        //
        //         console.log(json)
        //         resp = json
        //
        //
        //     });
        //
        // return resp;
        //  console.log(response)
        //  console.log(response.body)



        //const obj = await health.get_health();
        // return obj// JSON.stringify(obj)
        //JSON.parse(prettyJSON(health.get_health()));
    }
    @Get('/add_cron_job')
    @Header('content-type', 'application/json')
    async add_cron_job() {
        //this.add_cron_job()
        const obj = await health.get_health();
        return obj// JSON.stringify(obj)
        //JSON.parse(prettyJSON(health.get_health()));
    }


}