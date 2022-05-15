import secrets from '../utility-methods/env';

import {GrpcTransport} from '@protobuf-ts/grpc-transport';
import {ChannelCredentials} from '@grpc/grpc-js';
import {GrpcOptions} from '@protobuf-ts/grpc-transport/build/types/grpc-options';

export const grpcTransport = () => {
	const token = secrets.token;

	const grpcOptions : GrpcOptions = {
		host: 'invest-public-api.tinkoff.ru:443',
		meta: {
			'authorization' : 'Bearer ' + token
		},
		channelCredentials: ChannelCredentials.createSsl(null, null, null)
	};
	const grpcTransport = new GrpcTransport(grpcOptions);

	return grpcTransport;
};