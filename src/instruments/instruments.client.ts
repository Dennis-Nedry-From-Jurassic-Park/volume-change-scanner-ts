import {grpcTransport} from "../auth/connection";
import {InstrumentsServiceClient} from "../../protos_ts/instruments.client";
import {GrpcTransport} from "@protobuf-ts/grpc-transport";

import { Injectable, Inject } from '@nestjs/common';

import {
    GetDividendsRequest,
    GetDividendsResponse, InstrumentIdType, InstrumentRequest,
    InstrumentsRequest,
    InstrumentStatus
} from "../../protos_ts/instruments";

export class ExchangeInstruments {
  private readonly instrumentsServiceClient: InstrumentsServiceClient;

  constructor(grpcTransport: GrpcTransport) {
      this.instrumentsServiceClient = new InstrumentsServiceClient(grpcTransport);
  }

  checkInstrumentsUpdates = async() => {
  }

  getAvailableShares = async () => {
      const instrumentsRequest = InstrumentsRequest.create();
      instrumentsRequest.instrumentStatus = InstrumentStatus.ALL
      return this.instrumentsServiceClient.shares(instrumentsRequest);
  }
}
