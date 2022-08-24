import {prepare_candles_moex_exchange} from "../ms-change-price-strategy/prepare-candles-moex-exchange";

import {tickers} from "../ms-ti-base/tickers";
import {prepare_candles} from "../ms-change-price-strategy/prepare-candles";
import {
    insert_candles_to_all_usa_shares_except_morning_session
} from "../ms-change-price-strategy/prepare-candles-sbpe-exchange-main-session";
import {logger_cron, logger_market_depth} from "../logger/logger";
import WaitJob from "./wait-job";

const Queue = require('bull');

const waitJob = new WaitJob('08:22:30')

const firstJobAt = waitJob.getFirstJobAt();
const secondJobAt = waitJob.getSecondJobAt();
const thirdJobAt = waitJob.getThirdJobAt();

const cron_moex_exchange                    = `${firstJobAt} ? * MON-SAT`
const cron_spbe_exchange_morning_session    = `${secondJobAt} ? * MON-SAT`
const cron_spbe_exchange_main_session       = `${thirdJobAt} ? * MON-SAT`

const prepare_candles_moex_exchange_queue = new Queue('prepare_candles_moex_exchange_queue');
const prepare_candles_spbe_exchange_morning_session_queue = new Queue('prepare_candles_spbe_exchange_morning_session_queue');
const prepare_candles_spbe_exchange_main_session_queue = new Queue('prepare_candles_spbe_exchange_main_session_queue');

const data = {};

const options_for_moex_exchange_queue = {
    delay: 5000,
    attempts: 3,
    repeat: { cron: cron_moex_exchange }
};

prepare_candles_moex_exchange_queue.add(data, options_for_moex_exchange_queue);
prepare_candles_moex_exchange_queue.process((job) => prepare_candles_moex_exchange());
prepare_candles_moex_exchange_queue.on('completed', job => {
    logger_cron.log('debug', `Job prepare_candles_moex_exchange_queue with id ${job.id} has been completed`);
})
prepare_candles_moex_exchange_queue.on('failed', job => {
    logger_cron.error(`Job prepare_candles_moex_exchange_queue with id ${job.id} has been failed`);
})

const options_for_spbe_exchange_morning_session_queue = {
    delay: 5000,
    attempts: 3,
    repeat: { cron: cron_spbe_exchange_morning_session }
};

prepare_candles_spbe_exchange_morning_session_queue.add(data, options_for_spbe_exchange_morning_session_queue);
prepare_candles_spbe_exchange_morning_session_queue.process((job) => prepare_candles(tickers));
prepare_candles_spbe_exchange_morning_session_queue.on('completed', job => {
    logger_cron.log('debug', `Job prepare_candles_spbe_exchange_morning_session_queue with id ${job.id} has been completed`);
})
prepare_candles_spbe_exchange_morning_session_queue.on('failed', job => {
    logger_cron.error(`Job prepare_candles_spbe_exchange_morning_session_queue with id ${job.id} has been failed`);
})

const options_for_spbe_exchange_main_session_queue = {
    delay: 5000,
    attempts: 3,
    repeat: { cron: cron_spbe_exchange_main_session }
};

prepare_candles_spbe_exchange_main_session_queue.add(data, options_for_spbe_exchange_main_session_queue);
prepare_candles_spbe_exchange_main_session_queue.process((job) => insert_candles_to_all_usa_shares_except_morning_session());
prepare_candles_spbe_exchange_main_session_queue.on('completed', job => {
    logger_cron.log('debug', `Job prepare_candles_spbe_exchange_main_session_queue with id ${job.id} has been completed`);
})
prepare_candles_spbe_exchange_main_session_queue.on('failed', job => {
    logger_cron.error(`Job prepare_candles_spbe_exchange_main_session_queue with id ${job.id} has been failed`);
})

