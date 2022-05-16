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
import {TradingSchedulesCall} from '../types/type';


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

// const formattedPremarketStartTime = moment.unix(premarketStartTime.seconds).format('L');
// console.log(Timestamp.toDate(premarketStartTime));

const isWeekday = (): boolean => { return moment().isoWeekday() < 6; }

const terminateIfWeekendDay = () => {
    if(isWeekday()){

    } else {
        return process.exit();
    }
}

terminateIfWeekendDay();

tradingSchedules(Exchange.SPB);

/*

const time =
        tradingSchedulesResponse.response
            .exchanges[0]
            .days.filter(function(o) { return o.premarketStartTime; })[0]//.indexOf("premarketStartTime");
            //.map['premarketStartTime']//.filter(el => el.contains("premarketStartTime"));
            console.log(time)


            for (let [key, value] of Object.entries(time)) {
                console.log(key, value);
            }



            console.log(Object(time).premarketStartTime)

            console.log(Object(time).isTradingDay)
            console.log(Timestamp.toDate(Object(time).premarketStartTime));
            console.log(Timestamp.toDate(Object(time).premarketEndTime));
            console.log(Timestamp.toDate(Object(time).startTime));
            console.log(Timestamp.toDate(Object(time).endTime));


            */