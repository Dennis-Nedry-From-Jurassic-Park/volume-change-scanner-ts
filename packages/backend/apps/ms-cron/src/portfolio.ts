import {NestFactory} from '@nestjs/core';
import {FastifyAdapter, NestFastifyApplication,} from '@nestjs/platform-fastify';
import {PORT_CRON_ROBOT} from "../../ms-base/src/app/ports";
import {PortfolioModule} from "./portfolio.module";
import {ROUTE_ZERO} from "../../ms-base/src/app/routes";
import {NestExpressApplication} from "@nestjs/platform-express";

async function bootstrap() {
    const app_cron = await NestFactory.create<NestFastifyApplication>(
        PortfolioModule, new FastifyAdapter()
    );
    //await initApp(app_cron);
    await app_cron.enableCors();
    await app_cron.listen(PORT_CRON_ROBOT, ROUTE_ZERO);
    //await app_cron.listen(PORT_CRON_ROBOT);
}

// process.on('unhandledRejection', (err) => {
//     console.log('unhandledRejection', err);
// });

bootstrap().then(()=>{
    console.log(`🚀 ms:cron update balance portfolio is running on: http://localhost:${PORT_CRON_ROBOT}`);
    process.stdout.write(`🚀 ms:cron update balance portfolio is running on: http://localhost:${PORT_CRON_ROBOT}`);
}).catch(err=>{
    console.error(err);
    process.exit(1);
});