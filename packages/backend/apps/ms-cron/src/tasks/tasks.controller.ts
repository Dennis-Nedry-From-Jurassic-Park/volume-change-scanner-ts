import {Controller, Get} from "@nestjs/common";

@Controller('cron')
export class TasksController {
    @Get('/status')
    async status() {
        //return await exec_portfolio_balance_update();
    }
}