import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface RiskCashPerAccountPerDayEntity extends InMemoryDBEntity {
    date_time: string;
    account_id: string;
    count_deals: number;
}