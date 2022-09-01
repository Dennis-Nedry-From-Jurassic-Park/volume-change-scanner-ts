
import {default_retries, default_retry_delay} from "../../../ms-ti-base/wait";
import {
    insert_candles_to_all_usa_shares_except_morning_session
} from "../../../ms-change-price-strategy/prepare-candles-sbpe-exchange-main-session";

//import {default_retries, default_retry_delay} from "../../../src/ms-ti-base/wait";

const { delayedPromiseRetry } = require('delayed-promise-retry');

(async () => {
    try {
        await delayedPromiseRetry(() => insert_candles_to_all_usa_shares_except_morning_session(), default_retries, default_retry_delay);
    } catch(error) {
        console.log(error);
    }
})();