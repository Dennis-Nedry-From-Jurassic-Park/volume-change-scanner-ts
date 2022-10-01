import {Module} from '@nestjs/common';
import {TradingCalendarController} from "./app.controller";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    controllers: [TradingCalendarController],
    providers: []
})

export class TradingCalendarModule {}

