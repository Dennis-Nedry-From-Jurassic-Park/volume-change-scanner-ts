import {default_retries, default_retry_delay} from "../../../ms-ti-base/wait";
import {prepare_candles_moex_exchange} from "../../../ms-change-price-strategy/prepare-candles-moex-exchange";


const { delayedPromiseRetry } = require('delayed-promise-retry');

(async () => {
    try {
        await delayedPromiseRetry(() => prepare_candles_moex_exchange(), default_retries, default_retry_delay);
    } catch(error) {
        console.log(error);
    }
})();