import {Controller, Get, Header} from '@nestjs/common';
import {prettyJSON} from "../../ms-ti-base/output";
import {health} from "./tasks/tasks.constants";
import {ApiBearerAuth} from "@nestjs/swagger";
//import {exec_portfolio_balance_update} from "./portfolio.service";

@Controller('cron')
@ApiBearerAuth('token')
export class PortfolioController {
    @Get('/exec-portfolio-balance-update')
    async exec_portfolio_balance_update() {
        //return await exec_portfolio_balance_update();
    }
    @Get('/health')
    @Header('content-type', 'application/json')
    async get_health() {
        const obj = await health.get_health();
        return obj// JSON.stringify(obj)
        //JSON.parse(prettyJSON(health.get_health()));
    }


}