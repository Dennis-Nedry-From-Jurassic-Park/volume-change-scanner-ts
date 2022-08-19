import {Module} from '@nestjs/common';
import {InMemoryDBModule} from '@nestjs-addons/in-memory-db';
import {RiskController} from "./api.ti.risk.controller";
import {RiskAnyService} from "./api.ti.risk.service";


@Module({
    imports: [
        InMemoryDBModule.forRoot()
    ],
    controllers: [RiskController],
    providers: [RiskAnyService],
})
export class RiskModule {} // http://localhost:3002/risk/all