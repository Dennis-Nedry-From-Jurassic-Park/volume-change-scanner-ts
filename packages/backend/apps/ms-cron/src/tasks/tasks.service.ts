import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression, Timeout} from '@nestjs/schedule';
import {logger_cron} from "../../../ms-base/src/logger/logger";
import moment from "moment";
import {get_portfolio_balance} from "../../../ms-base/src/metrics/portfolio";
import WaitJob from "../wait-job";
import {prepare_candles_moex_exchange} from "../../../ms-change-price-strategy/prepare-candles-moex-exchange";
import {prepare_candles} from "../../../ms-change-price-strategy/prepare-candles";
import {tickers} from "../../../ms-ti-base/tickers";
import {
    insert_candles_to_all_usa_shares_except_morning_session
} from "../../../ms-change-price-strategy/prepare-candles-sbpe-exchange-main-session";


const waitJob = new WaitJob('20:35:30')

const firstJobAt = waitJob.getFirstJobAt();
const secondJobAt = waitJob.getSecondJobAt();
const thirdJobAt = waitJob.getThirdJobAt();

const cron_moex_exchange                    = `${firstJobAt} ? * MON-SAT`
const cron_spbe_exchange_morning_session    = `${secondJobAt} ? * MON-SAT`
const cron_spbe_exchange_main_session       = `${thirdJobAt} ? * MON-SAT`

const timeout = waitJob.getCloseWorkerAfterMinutes() * 60 * 1000;


@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    // @Cron(CronExpression.EVERY_30_SECONDS)
    // get_portfolio_balance() {
    //     const msg = `${moment().format('HH:mm:ss')} Job portfolio_balance_update_queue with id has been started`;
    //     logger_cron.log('debug', msg);
    //     get_portfolio_balance().then(() => console.log(msg));
    // }

    @Timeout(0)
    prepare_candles_moex_exchange() {
        const msg = `${moment().format('HH:mm:ss')} Job prepare_candles_moex_exchange has been completed`;
        prepare_candles_moex_exchange().then(() => console.log(msg));
        logger_cron.log('debug', msg);
    }
    //
    // @Timeout(timeout)
    // prepare_candles_spbe_exchange_morning_session() {
    //     const msg = `${moment().format('HH:mm:ss')} Job prepare_candles_spbe_exchange_morning_session has been completed`;
    //     prepare_candles(tickers).then(() => console.log(msg));
    //     logger_cron.log('debug', msg);
    // }
    //
    // @Timeout(2 * timeout)
    // prepare_candles_spbe_exchange_main_session() {
    //     const msg = `${moment().format('HH:mm:ss')} Job prepare_candles_spbe_exchange_main_session has been completed`;
    //     insert_candles_to_all_usa_shares_except_morning_session().then(() => console.log(msg));
    //     logger_cron.log('debug', msg);
    // }
}