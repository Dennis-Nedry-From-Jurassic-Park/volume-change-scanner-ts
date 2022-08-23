// import {prepare_candles_moex_exchange} from "../ms-change-price-strategy/prepare-candles-moex-exchange";
//
// const schedule = require('node-schedule');
//
// console.log('log every 5 seconds!')
//
// const job_prepare_candles_moex_exchange = schedule.scheduleJob('0 30 11 * * 1-5', prepare_candles_moex_exchange().then(() => console.log('prepare candles for MOEX exchange shares (rus only)')));


const Bree = require('bree');
const Graceful = require('@ladjs/graceful');
import * as path from 'node:path';
// https://github.com/breejs/bree/blob/master/examples/typescript/package.json

// 31824770
// 31825134
const jobs = [
    {
        name: 'prepare_candles_moex_exchange',
        //name: 'prepare-candles-moex-exchange',
        //path: './src/ms-change-price-strategy/prepare-candles-moex-exchange.ts',
        //path: './src/ms-cron/jobs/prepare_candles_moex_exchange.ts',
        //path: './src/ms-cron/jobs/prepare_candles_moex_exchange.ts',
        interval: 'at 12:17:30', // заюзать момент add
        timeout: 0,
        closeWorkerAfterMs: 1000 * 60 * 8
    },
    // {
    //     name: 'prepare-candles-sbpe-exchange-morning-session',
    //     interval: 'at 09:33',
    //     timeout: 1000 * 60 * 5,
    //     closeWorkerAfterMs: 1000 * 60 * 5
    // },
    // {
    //     name: 'prepare-candles-sbpe-exchange-main-session',
    //     interval: 'at 09:15',
    //     timeout: 0,
    //     closeWorkerAfterMs: 1000 * 60 * 15
    // }
    //{ name: 'load_candles_for_all_usa_shares_except_spbe_exchange_morning_session', interval: 'at 08:00', timeout: 0 },
    //{ name: 'load_candles_for_russian_shares', interval: 'at 08:00', timeout: 0 },
];
//interval: 'every 1 minute'
//interval: '10s',
let sofar = 0;
const limit = 10;

const handler = (msg) => {
    let threadId = bree.getWorkerMetadata(msg.name).worker.threadId;
    console.log(`Iteration ${++sofar}: ${msg.message} thread ${threadId}`);
    if (sofar === limit) {
        bree.stop();
        console.log("limit reached, stopped bree...");
    }
}

// TODO: stop only a specific job:
//bree.stop('beep');


//import { parentPort } from 'worker_threads';

//parentPort.postMessage('message from worker');
// 31824442
const bree = new Bree({
    root: path.join(__dirname, 'jobs'), // false,//
    jobs: jobs,
    defaultExtension: 'ts',
    //workerMessageHandler: handler,
    outputWorkerMetadata: true
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

(async () => {
    await bree.start().then(() => { console.log("started bree...") });

})();

export {}