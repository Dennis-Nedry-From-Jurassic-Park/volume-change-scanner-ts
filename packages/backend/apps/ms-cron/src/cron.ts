import moment from "moment";

const Bree = require('bree');
const Graceful = require('@ladjs/graceful');
import * as path from 'node:path';
import WaitJob from "./wait-job";

const waitJob = new WaitJob('14:44:00');

const closeWorkerAfterMinutes = waitJob.getCloseWorkerAfterMinutes()

const jobs = [
    {
        name: 'prepare_candles_moex_exchange',
        interval: `at ${waitJob.getFirstJobAt()}`,
        timeout: 0,
        closeWorkerAfterMs: 1000 * 60 * closeWorkerAfterMinutes
    },
    {
        name: 'prepare-candles-spbe-exchange-morning-session',
        interval: `at ${waitJob.getSecondJobAt()}`,
        timeout: 0,
        closeWorkerAfterMs: 1000 * 60 * closeWorkerAfterMinutes
    },
    {
        name: 'prepare-candles-spbe-exchange-main-session',
        interval: `at ${waitJob.getThirdJobAt()}`,
        timeout: 0
    }
];

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

const bree = new Bree({
    root: path.join(__dirname, 'jobs'),
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