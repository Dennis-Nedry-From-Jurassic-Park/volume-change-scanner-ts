import { Injectable } from '@nestjs/common';
//import {ICronJobConfig} from "nest-schedule/dist/interfaces/cron-job-config.interface";
import {CronExpression, SchedulerRegistry} from "@nestjs/schedule";
import {CronJob, CronJobParameters} from "cron";

export const SCHEDULE_SERVICE = 'ScheduleService';

@Injectable()
export class ScheduleService {
    called = false;
    calledDynamic = false;

    constructor(private readonly schedulerRegistry: SchedulerRegistry) {}



    // constructor(
    //     @InjectSchedule() private readonly schedule: Schedule,
    // ) {}
    add_job(jobName: string) {
        const job = new CronJob(CronExpression.EVERY_12_HOURS, () => {}, undefined, false, undefined, undefined, false);
        this.schedulerRegistry.addCronJob(jobName, job);
    }

    run_job(jobName: string) {
        const job = this.schedulerRegistry.getCronJob(jobName);
        job.start();
    }

    stop_job(jobName: string) {
        const job = this.schedulerRegistry.getCronJob(jobName);
        job.stop();
    }

    // create_timeout_job(jobName: string, timeout: number, callback: JobCallback, config?: ICronJobConfig) {
    //     this.schedule.scheduleTimeoutJob(jobName, timeout, callback);
    // }

    // cancel_job(jobName: string) {
    //     this.schedule.cancelJob(jobName);
    // }
}

