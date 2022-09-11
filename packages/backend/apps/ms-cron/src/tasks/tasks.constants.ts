import {prettyJSON} from "../../../ms-ti-base/output";

class HealthService {
    private health: Map<string, string>;

    constructor() {
        this.health = new Map()
        this.health.set('status', 'runned');
        this.health.set('prepare_candles_moex_exchange', 'none');
        this.health.set('prepare_candles_spbe_exchange_morning_session', 'none');
        this.health.set('prepare_candles_spbe_exchange_main_session', 'none');
    }

    async set(key: string, val: string) { return this.health.set(key, val); }
    async get(key: string) { return this.health.get(key); }
    async get_health() {
        let jsonObject = {};
        this.health.forEach((value, key) => {
            jsonObject[key] = value
        });
        console.log(prettyJSON(jsonObject))
        return jsonObject;
    }
}

export let health = new HealthService();