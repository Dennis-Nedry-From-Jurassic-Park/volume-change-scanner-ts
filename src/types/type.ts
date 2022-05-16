import {FinishedUnaryCall, UnaryCall} from '@protobuf-ts/runtime-rpc/build/types/unary-call.d';

export type TradingSchedulesCall = FinishedUnaryCall<TradingSchedulesRequest, TradingSchedulesResponse>;
export type ShareCall = Promise<UnaryCall<InstrumentRequest, ShareResponse>>;