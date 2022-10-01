import {NestFactory} from '@nestjs/core';
import {FastifyAdapter, NestFastifyApplication,} from '@nestjs/platform-fastify';
import {PORT_CRON_ROBOT} from "../../ms-base/src/app/ports";
import {ROUTE_ZERO} from "../../ms-base/src/app/routes";
import {PortfolioModule} from "./portfolio.module";
import {HttpExceptionFilter} from "@algoan/nestjs-http-exception-filter";
import {TradingScheduleModule} from "./app.module";

const ms_name = 'ms:cron'
const ms_description = 'update balance portfolio'

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(TradingScheduleModule, new FastifyAdapter());
    await app.enableCors();
    await app.enableShutdownHooks();
    await app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(PORT_CRON_ROBOT, ROUTE_ZERO);
}

bootstrap().then(()=>{
    console.log(` 🚀 ${ms_name} ${ms_description} is running on: http://localhost:${PORT_CRON_ROBOT}`);
    process.stdout.write(` 🚀 ${ms_name} ${ms_description} is running on: http://localhost:${ROUTE_ZERO}`);
}).catch(err=>{
    console.error(err);
    process.exit(1);
});