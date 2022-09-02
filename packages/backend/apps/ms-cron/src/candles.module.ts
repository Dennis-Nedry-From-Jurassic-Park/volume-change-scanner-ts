import {Module} from '@nestjs/common';
import {PortfolioController} from "./portfolio.controller";
import {ScheduleModule} from "@nestjs/schedule";
import {TasksModule} from "./tasks/tasks.module";

@Module({
    imports: [ScheduleModule.forRoot(), TasksModule],
    controllers: [PortfolioController],
    providers: []
})

export class PortfolioModule {}