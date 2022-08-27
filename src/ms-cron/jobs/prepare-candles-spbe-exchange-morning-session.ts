import {prepare_candles} from "../../ms-change-price-strategy/prepare-candles";
import {tickers} from "../../ms-ti-base/tickers";

import {default_retries, default_retry_delay} from "../../ms-ti-base/wait";

const { delayedPromiseRetry } = require('delayed-promise-retry');

(async () => {
    try {
        await delayedPromiseRetry(() => prepare_candles(tickers), default_retries, default_retry_delay);
    } catch(error) {
        console.log(error);
    }
})();