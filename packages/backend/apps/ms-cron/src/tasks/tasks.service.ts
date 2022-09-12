import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression, Timeout} from '@nestjs/schedule';
import {logger_cron} from "../../../ms-base/src/logger/logger";
import moment from "moment";
import {get_portfolio_balance} from "../../../ms-base/src/metrics/portfolio";
import WaitJob from "../wait-job";
import {prepare_candles_moex_exchange} from "../../../ms-change-price-strategy/src/prepare-candles-moex-exchange";
import {prepare_candles} from "../../../ms-change-price-strategy/src/prepare-candles";
import {tickers} from "../../../ms-ti-base/tickers";
import {
    insert_candles_to_all_usa_shares_except_morning_session
} from "../../../ms-change-price-strategy/src/prepare-candles-spbe-exchange-main-session";
import {prettyJSON} from "../../../ms-ti-base/output";
import {health} from "./tasks.constants";
import {delay} from "../../../ms-ti-base/wait";


const waitJob = new WaitJob('20:35:30')

const firstJobAt = waitJob.getFirstJobAt();
const secondJobAt = waitJob.getSecondJobAt();
const thirdJobAt = waitJob.getThirdJobAt();

const cron_moex_exchange = `${firstJobAt} ? * MON-SAT`
const cron_spbe_exchange_morning_session = `${secondJobAt} ? * MON-SAT`
const cron_spbe_exchange_main_session = `${thirdJobAt} ? * MON-SAT`

const timeout = waitJob.getCloseWorkerAfterMinutes() * 60 * 1000;

health.set('start_dt', moment().toISOString());

@Injectable()
export class TasksService {
    @Cron(CronExpression.EVERY_30_SECONDS)
    get_portfolio_balance() {
        const msg = `${moment().format('HH:mm:ss')} Job portfolio_balance_update_queue with id has been started`;
        logger_cron.log('debug', msg);
        get_portfolio_balance().then(() => console.log(msg));
    }

    // @Timeout(0)
    // async prepare_candles_moex_exchange() {
    //     const job = 'prepare_candles_moex_exchange';
    //     const msg = `${moment().format('HH:mm:ss')} Job ${job} has been completed`;
    //     await health.set(job, 'runned');
    //     prepare_candles_moex_exchange()
    //         .then(() => {
    //             console.log(msg);
    //             logger_cron.log('debug', msg);
    //             health.set(job, 'done');
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             logger_cron.error(err);
    //             health.set(job, 'fail');
    //         });
    // }
    //
    //
    // @Timeout(timeout)
    // async prepare_candles_spbe_exchange_morning_session() {
    //     const job = 'prepare_candles_spbe_exchange_morning_session';
    //     const msg = `${moment().format('HH:mm:ss')} Job ${job} has been completed`;
    //     prepare_candles(tickers)
    //         .then(() => {
    //             console.log(msg);
    //             logger_cron.log('debug', msg);
    //             health.set(job, 'done');
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             logger_cron.error(err);
    //             health.set(job, 'fail');
    //         });
    // }
    //
    // @Timeout(2 * timeout)
    // async prepare_candles_spbe_exchange_main_session() {
    //     const job = 'prepare_candles_spbe_exchange_main_session';
    //     const msg = `${moment().format('HH:mm:ss')} Job ${job} has been completed`;
    //     insert_candles_to_all_usa_shares_except_morning_session()
    //         .then(() => {
    //             console.log(msg);
    //             logger_cron.log('debug', msg);
    //             health.set(job, 'done');
    //             health.set('end_dt', moment().toISOString());
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             logger_cron.error(err);
    //             health.set(job, 'fail');
    //             health.set('end_dt', moment().toISOString());
    //         });
    // }
}
// {"status":"runned","prepare_candles_moex_exchange":"done","prepare_candles_spbe_exchange_morning_session":"done","prepare_candles_spbe_exchange_main_session":"done","start_dt":"2022-09-09T14:03:46.760Z","end_dt":"2022-09-09T14:39:03.344Z"}
// http://localhost:9201/cron/health
