import {Injectable, Logger} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import {CronCommand, CronJob} from 'cron';
import {DateTime} from "luxon";



@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);

    constructor(private schedulerRegistry: SchedulerRegistry) {}

    async testCron() {
        const job = new CronJob('2 * * * * *', () => {
            this.logger.log('My cron running...');
        });

        this.schedulerRegistry.addCronJob('sec', job);
        job.start();
    }

    async testCron2(cronTime: string | Date | DateTime) {
        const job = new CronJob(cronTime, () => {
            this.logger.log('My cron running 2...');
        }, undefined, false, undefined, undefined, true);

        this.schedulerRegistry.addCronJob('sec', job);
        job.start();
    }

    async start_cron_job(
        cronTime: string | Date | DateTime,
        jobName: string,
        onTick: CronCommand
    ) {
        this.logger.log(jobName + ' cron job is running ...');

        const job = new CronJob(cronTime, onTick, undefined, false, undefined, undefined, true);

        this.schedulerRegistry.addCronJob(jobName, job);
        job.start();
    }

    async stop_cron_job(jobName: string) {
        this.schedulerRegistry.getCronJob(jobName).stop();
    }

    async delete_cron_job(jobName: string) {
        this.schedulerRegistry.deleteCronJob(jobName);
    }

}