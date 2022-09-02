import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression, Timeout} from '@nestjs/schedule';
import {logger_cron} from "../../../ms-base/src/logger/logger";
import moment from "moment";
import {get_portfolio_balance} from "../../../ms-base/src/metrics/portfolio";
import WaitJob from "../wait-job";
import {prepare_candles_moex_exchange} from "../../../ms-change-price-strategy/prepare-candles-moex-exchange";


const waitJob = new WaitJob('20:35:30')

const firstJobAt = waitJob.getFirstJobAt();
const secondJobAt = waitJob.getSecondJobAt();
const thirdJobAt = waitJob.getThirdJobAt();

const cron_moex_exchange                    = `${firstJobAt} ? * MON-SAT`
const cron_spbe_exchange_morning_session    = `${secondJobAt} ? * MON-SAT`
const cron_spbe_exchange_main_session       = `${thirdJobAt} ? * MON-SAT`


@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    // @Cron(CronExpression.EVERY_30_SECONDS)
    // get_portfolio_balance() {
    //     const msg = `${moment().format('HH:mm:ss')} Job portfolio_balance_update_queue with id has been started`;
    //     logger_cron.log('debug', msg);
    //     get_portfolio_balance().then(() => console.log(msg));
    // }

    @Timeout(5000)
    @Cron(cron_moex_exchange)
    prepare_candles_moex_exchange() {
        const msg = `${moment().format('HH:mm:ss')} Job prepare_candles_moex_exchange with id has been started`;
        logger_cron.log('debug', msg);
        prepare_candles_moex_exchange().then(() => console.log(msg));
    }
}