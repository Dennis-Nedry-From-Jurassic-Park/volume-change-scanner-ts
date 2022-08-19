import {Controller, Get, Post, Body, Param} from '@nestjs/common';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { RiskCashPerAccountPerDayEntity } from './db/in-memory-db/risk.per.account.per.day.entity';
import {RiskAnyService} from './api.ti.risk.service';
import {v4 as uuidv4} from 'uuid';

@Controller()
export class RiskController {
    constructor(//private readonly riskService: RiskAnyService,
                private riskCashPerAccountPerDayService: InMemoryDBService<RiskCashPerAccountPerDayEntity>
    ) {}

    @Get('all')
    getProducts() {
        return this.riskCashPerAccountPerDayService.getAll();
    }

    @Get('/createDefault')
    AddDefault() {
        const it: RiskCashPerAccountPerDayEntity = {
            date_time: 'string',
            account_id: 'string',
            id: uuidv4(),
            count_deals: 1
        };
        this.AddRiskCashPerAccountPerDayEntity(it)
    }

    @Post('/create')
    AddRiskCashPerAccountPerDayEntity(@Body() it: RiskCashPerAccountPerDayEntity): RiskCashPerAccountPerDayEntity {
        return this.riskCashPerAccountPerDayService.create(it);
    }

    // @Get(':accountId')
    // GetProductByDateTime(@Param('accountId') accountId: number) {
    //     return this.riskCashPerAccountPerDayService.query(data => data.accountId === +accountId)
    // }

    @Get('/:account_id')
    GetProductByAccountId(@Param('account_id') account_id: number) {
        return this.riskCashPerAccountPerDayService.query((data:any) => data.account_id === +account_id)
    }



}