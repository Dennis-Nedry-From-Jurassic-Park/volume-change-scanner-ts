import {OperationsServiceClient} from "../protos_ts/operations.client";
import {OperationsRequest, OperationState, PortfolioRequest} from "../protos_ts/operations";

import {Timestamp} from "../protos_ts/google/protobuf/timestamp";
import {InstrumentsServiceClient} from "../protos_ts/instruments.client";
import {grpcTransport} from "./auth/connection";

import moment from 'moment';

import {
    GetDividendsRequest,
    GetDividendsResponse, InstrumentIdType, InstrumentRequest,
    InstrumentsRequest,
    InstrumentStatus
} from "../protos_ts/instruments";


export const main = async () => {
    const operationsRequest = OperationsRequest.create();
    operationsRequest.accountId = "111"!;
    operationsRequest.from = Timestamp.fromDate(moment().subtract(1, "years").toDate());
    operationsRequest.to = Timestamp.fromDate(moment().toDate());
    operationsRequest.state = OperationState.EXECUTED;
    operationsRequest.figi = "BBG000C0HQ54";

    const operationsServiceClient = new OperationsServiceClient(grpcTransport);

    const portfolioRequest = PortfolioRequest.create();

    portfolioRequest.accountId = "111"!;

    const response = operationsServiceClient.getPortfolio(portfolioRequest);


    const instrumentsServiceClient = new InstrumentsServiceClient(grpcTransport);

    const instrumentsRequest = InstrumentsRequest.create();
    instrumentsRequest.instrumentStatus = InstrumentStatus.ALL

    let sharesResponse = await instrumentsServiceClient.shares(instrumentsRequest)
    console.log(JSON.stringify(sharesResponse.response, (_, v) => typeof v === 'bigint' ? v.toString() : v))
};

main();
