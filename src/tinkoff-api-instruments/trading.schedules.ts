import {
	InstrumentsServiceClient
} from '../../protos_ts/instruments.client';

import {Timestamp} from '../../protos_ts/google/protobuf/timestamp';

import {
	TradingSchedulesRequest,
	TradingSchedulesResponse,
	TradingSchedule,
	TradingDay,
} from '../../protos_ts/instruments';

import moment from 'moment';

import {grpcTransport} from '../auth/connection';
import {_stringify} from '../utils/json';

import {FinishedUnaryCall, UnaryCall} from '@protobuf-ts/runtime-rpc/build/types/unary-call.d';

type TradingSchedulesCall = FinishedUnaryCall<TradingSchedulesRequest, TradingSchedulesResponse>;

enum Exchange {
    SPB = "SPB",
    MOEX = "MOEX"
}

const tradingSchedules = async (exchange: Exchange) => {
    const day = moment().add(0, 'days').toDate();
    const getTradingSchedulesResponse = await getTradingSchedules(exchange, day, day);
    const resp = await _stringify(getTradingSchedulesResponse.response);

    console.log(getTradingDay(getTradingSchedulesResponse, exchange));
    console.log(isTradingDay(getTradingSchedulesResponse, exchange));
}

const getTradingSchedules = (
    exchange: Exchange,
    from: Date,
    to: Date
    // TODO:
    // moment().toDate()
    // moment().subtract(2, 'days').toDate()
): UnaryCall<TradingSchedulesRequest, TradingSchedulesResponse> => {
    const instrumentsServiceClient = new InstrumentsServiceClient(grpcTransport());

    const tradingSchedulesRequest = TradingSchedulesRequest.create();
    tradingSchedulesRequest.exchange = exchange;
    tradingSchedulesRequest.from = Timestamp.fromDate(from);
    tradingSchedulesRequest.to = Timestamp.fromDate(to);
    const tradingSchedulesCall =
        instrumentsServiceClient.tradingSchedules(tradingSchedulesRequest);
    return tradingSchedulesCall;
}

const getTradingDay = (
    tradingSchedulesCall: TradingSchedulesCall, exchange: Exchange
): TradingDay => {
    return tradingSchedulesCall
           .response
           .exchanges
           .filter((ts:TradingSchedule) => ts.exchange === exchange)[0]
           .days[0];
}

const isTradingDay = (
    tradingSchedulesCall: TradingSchedulesCall, exchange: Exchange
): boolean => {
   return getTradingDay(tradingSchedulesCall, exchange).isTradingDay
}

const getTradingDateTime = (
    tradingSchedulesCall: TradingSchedulesCall, exchange: Exchange
): Timestamp | undefined => {
    return getTradingDay(tradingSchedulesCall, exchange).date;
}

tradingSchedule