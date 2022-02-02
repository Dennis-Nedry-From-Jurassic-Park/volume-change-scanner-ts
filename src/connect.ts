import {GrpcTransport} from "@protobuf-ts/grpc-transport";
import {GrpcOptions} from "@protobuf-ts/grpc-transport/build/types/grpc-options";
import {ChannelCredentials} from "@grpc/grpc-js";

import {Timestamp} from "../protos_ts/google/protobuf/timestamp";
import {InstrumentsServiceClient} from "../protos_ts/instruments.client";
import {GetDividendsRequest} from "../protos_ts/instruments";
import {OperationsServiceClient} from "../protos_ts/operations.client";
import {OperationsRequest, OperationState, PortfolioRequest} from "../protos_ts/operations";
import {
    InstrumentIdType,
    InstrumentRequest,
    InstrumentsRequest,
    InstrumentStatus
} from "../protos_ts/instruments";
import moment from 'moment';


export const connect = async (sheet: string) => {
    const brokerAccountId = sheet === '' ? "" : "";

    const operationsRequest = OperationsRequest.create();
    operationsRequest.accountId = brokerAccountId;
    operationsRequest.from = Timestamp.fromDate(moment().subtract(3, "years").toDate());

    operationsRequest.to = Timestamp.fromDate(moment().toDate());
    operationsRequest.state = OperationState.EXECUTED;
    operationsRequest.figi = "BBG000C0HQ54";

    const token = "";

    let o : GrpcOptions = {
        host: "invest-public-api.tinkoff.ru:443",
        meta: {
            "authorization" : "Bearer " + token
        },
        channelCredentials: ChannelCredentials.createSsl(null, null, null)
    }
    const gt = new GrpcTransport(o);

    const operationsServiceClient = new OperationsServiceClient(gt);

    const portfolioRequest = PortfolioRequest.create();

    portfolioRequest.accountId = brokerAccountId;

    const response = operationsServiceClient.getPortfolio(portfolioRequest);

    const instrumentsServiceClient = new InstrumentsServiceClient(gt);

    const instrumentsRequest = InstrumentsRequest.create();
    instrumentsRequest.instrumentStatus = InstrumentStatus.ALL

    let sharesResponse = await instrumentsServiceClient.shares(instrumentsRequest)
    console.log(await JSON.stringify(await sharesResponse.response, (_, v) => typeof v === 'bigint' ? v.toString() : v))
};

connect("");