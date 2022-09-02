import {Controller, Get} from '@nestjs/common';
//import {exec_portfolio_balance_update} from "./portfolio.service";

@Controller('cron')
export class PortfolioController {
    @Get('/exec-portfolio-balance-update')
    async exec_portfolio_balance_update() {
        //return await exec_portfolio_balance_update();
    }


}