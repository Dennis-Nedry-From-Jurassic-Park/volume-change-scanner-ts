import {logger_cron} from "../../ms-base/src/logger/logger";
import {get_portfolio_balance} from "../../ms-base/src/metrics/portfolio";
import secrets from "../../ms-base/src/utility-methods/env";
import moment from "moment";

const Queue = require('bull');

const redis_config = { port: secrets.redisPort, host: secrets.redisHost, password: secrets.redisPassword }

const cron_portfolio_balance = `*/15 ? * MON-SAT`;

const portfolio_balance_update_queue = new Queue('portfolio_balance_update_queue', { redis: redis_config });

const data = {};

const options_for_portfolio_balance_update_queue = {
    delay: 5000,
    attempts: 2,
    repeat: { cron: cron_portfolio_balance }
};

portfolio_balance_update_queue.add(data, options_for_portfolio_balance_update_queue);

export const exec_portfolio_balance_update = async () => {
    portfolio_balance_update_queue.process((job) => get_portfolio_balance());
    portfolio_balance_update_queue.on('completed', job => {
        logger_cron.log('debug', moment().format('HH:mm:ss') + `Job portfolio_balance_update_queue with id ${job.id} has been completed`);
    })
    portfolio_balance_update_queue.on('failed', job => {
        logger_cron.error(moment().format('HH:mm:ss') + ` Job portfolio_balance_update_queue with id ${job.id} has been failed`);
    })
};
