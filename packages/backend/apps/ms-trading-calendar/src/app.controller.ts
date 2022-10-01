import {Controller, Get, Header} from '@nestjs/common';
import {trading_shedule_service} from "./app.service";

@Controller('trading-shedule')
export class TradingCalendarController {
    @Get('/today')
    @Header('content-type', 'application/json')
    async get_trading_shedules() {
        return await trading_shedule_service.get_trading_shedules();
    }
} // http://localhost:9212/trading-shedule/today