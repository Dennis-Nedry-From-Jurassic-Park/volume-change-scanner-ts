import {
	InstrumentsServiceClient
} from '../../protos_ts/instruments.client';

import {Timestamp} from '../../protos_ts/google/protobuf/timestamp';

import {
	SharesResponse,
	InstrumentIdType,
	InstrumentsRequest,
	InstrumentRequest,
	InstrumentStatus,
	TradingSchedulesRequest
} from '../../protos_ts/instruments';

import {_stringify} from '../utils/json';

import {grpcTransport} from '../auth/connection';
import {asyncWriteFile} from '../utility-methods/file';

import moment from 'moment';

import {ShareCall} from '../types/type';

const saveShares = async () => {
    const sharesCall = await getShares();
    asyncWriteFile("../../shares.json", await _stringify(sharesCall.response));
}

const getShares = async (): ShareCall => {
    const instrumentsServiceClient = new InstrumentsServiceClient(grpcTransport());

    const instrumentsRequest = InstrumentsRequest.create();
    	  instrumentsRequest.instrumentStatus = InstrumentStatus.ALL;
    const sharesResponse = await instrumentsServiceClient.shares(instrumentsRequest);

    return sharesResponse
}

const shareByFigi = async (shareId: string): ShareCall => {
    const instrumentsServiceClient = new InstrumentsServiceClient(grpcTransport());
    const instrumentRequest = InstrumentRequest.create();
          instrumentRequest.id = shareId;
    	  instrumentRequest.idType = InstrumentIdType.INSTRUMENT_ID_TYPE_FIGI;

    const sharesResponse = await instrumentsServiceClient.shareBy(instrumentRequest);
    const share = _stringify(sharesResponse.response);
    console.log(share);
    return sharesResponse;
}

const check = async () => {
    await saveShares();
    const resp = await shareByFigi("BBG004MN1R41");
    console.log(resp.response.instrument)
}

check();