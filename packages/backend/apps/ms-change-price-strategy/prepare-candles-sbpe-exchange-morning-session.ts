import {prepare_candles} from "./prepare-candles";
import {tickers} from "../ms-ti-base/tickers";

//prepare_candles(tickers).then(() => console.log('prepare candles for SPBE morning session shares (usa only)'));


const { delayedPromiseRetry } = require('delayed-promise-retry');

(async () => {
    // const fn = async () => {
    //     console.log('trying...');
    //
    //     throw new Error();
    // };
    const retries = 2;
    const retryDelay = 5000;

    try {
        await delayedPromiseRetry(() => prepare_candles(tickers), retries, retryDelay);
    } catch(error) {
        console.log(error);
    }
})();