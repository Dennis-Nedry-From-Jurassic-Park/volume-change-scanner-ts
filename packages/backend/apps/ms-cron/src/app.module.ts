import {Module} from '@nestjs/common';
import {SCHEDULE_SERVICE, ScheduleService} from "./app.service";
//import {ScheduleModule} from 'nest-schedule';
import {PortfolioController2} from "./portfolio.controller";
import {HttpModule} from "@nestjs/axios";
import {ScheduleController} from "./app.controller";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [HttpModule, ScheduleModule.forRoot()],
    controllers: [ScheduleController], // ScheduleController
    providers: [ScheduleService]
    // providers: [//ScheduleService]
    //     {
    //         useClass: ScheduleService,
    //         provide: SCHEDULE_SERVICE
    //     }
    //
    // ],
})
export class TradingScheduleModule {}