import {NestFactory} from '@nestjs/core';
import {FastifyAdapter, NestFastifyApplication,} from '@nestjs/platform-fastify';
import {PORT_TRADING_CALENDAR_ROBOT} from "../../ms-base/src/app/ports";
import {ROUTE_ZERO} from "../../ms-base/src/app/routes";
import {TradingCalendarModule} from "./app.module";
import {HttpExceptionFilter} from "@algoan/nestjs-http-exception-filter";
import {TinkoffApiError} from "tinkoff-invest-api";

const ms_name = 'ms:trading:calendar'
const ms_description = 'get trading shedules for some exchanges'
//TinkoffApiError.
//const exception = new HttpExceptionFilter(TinkoffApiError, {})
// TinkoffApiError
async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(TradingCalendarModule, new FastifyAdapter());
    await app.enableCors();
    await app.enableShutdownHooks()
    await app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(PORT_TRADING_CALENDAR_ROBOT, ROUTE_ZERO);
}

// process.on('unhandledRejection', (err) => {
//     console.log('unhandledRejection', err);
// });

bootstrap().then(()=>{
    console.log(` 🚀 ${ms_name} ${ms_description} is running on: http://localhost:${PORT_TRADING_CALENDAR_ROBOT}`);
    process.stdout.write(` 🚀 ${ms_name} ${ms_description} is running on: http://localhost:${ROUTE_ZERO}`);
}).catch(err=>{
    console.error(err);
    process.exit(1);
});