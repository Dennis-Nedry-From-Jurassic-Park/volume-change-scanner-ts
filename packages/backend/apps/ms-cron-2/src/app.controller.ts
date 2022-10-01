import {Controller, Get, Header, Param, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {prepare_candles_spbe_exchange_morning_session_} from "../../ms-cron/src/app.controller";
import moment from "moment";
import {health} from "../../ms-cron/src/tasks/tasks.constants";
import {logger_cron} from "../../ms-base/src/logger/logger";
import {prepare_candles_moex_exchange} from "../../ms-change-price-strategy/src/prepare-candles-moex-exchange";
import {Exchange} from "../../ms-base/src/constants/exchange";
import {prepare_candles} from "../../ms-change-price-strategy/src/prepare-candles";
import {tickers} from "../../ms-ti-base/tickers";
import {
    insert_candles_to_all_usa_shares_except_morning_session
} from "../../ms-change-price-strategy/src/prepare-candles-spbe-exchange-main-session";

@Controller('cron')
export class AppController {
    private NEVER_EXECUTED = '0 0 1 1 *'; // run once, see param runOnInit

    constructor(private readonly appService: AppService) {}

    @Get('test')
    testCron(){
        return this.appService.testCron();
    }

    @Get('/health')
    @Header('content-type', 'application/json')
    async get_health() {
        return await health.get_health();
    }

    @Get('start/:job_name')
    start_cron_job(@Param('job_name') job_name){
        const job = `prepare_candles_${job_name}_exchange`;
        const msg = `${moment().format('HH:mm:ss')} Job ${job} has been started`;

        this.appService.start_cron_job(this.NEVER_EXECUTED, job, () => {
            if (job_name.toUpperCase() === Exchange.MOEX) {
                // prepare_candles_moex_exchange()
                //     .then(() => {
                //         logger_cron.log('debug', msg);
                //         health.set(job, 'done').then(() => console.log('status of job ' + job + ' is set to done'));
                //     })
                //     .catch(err => {
                //         console.log(err);
                //         logger_cron.error(err);
                //         health.set(job, 'fail').then(() => console.log('status of job ' + job + ' is set to fail'));
                //     });
            } else if (job_name.toUpperCase() === Exchange.SPB_MORNING) {
                // prepare_candles(tickers)
                //     .then(() => {
                //         console.log(msg);
                //         logger_cron.log('debug', msg);
                //         health.set(job, 'done').then(() => console.log('status of job ' + job + ' is set to done'));
                //     })
                //     .catch(err => {
                //         console.log(err);
                //         logger_cron.error(err);
                //         health.set(job, 'fail').then(() => console.log('status of job ' + job + ' is set to fail'));
                //     });
            } else if (job_name.toUpperCase() === Exchange.SPB) {
                insert_candles_to_all_usa_shares_except_morning_session()
                    .then(() => {
                        console.log(msg);
                        logger_cron.log('debug', msg);
                        health.set(job, 'done').then(() => console.log('status of job ' + job + ' is set to done'));
                    })
                    .catch(err => {
                        console.log(err);
                        logger_cron.error(err);
                        health.set(job, 'fail').then(() => console.log('status of job ' + job + ' is set to fail'));
                    });

            } else if (job_name.toUpperCase() === Exchange.SPB_HK) {

            }
        }).then(() => console.log(msg));
    }
}