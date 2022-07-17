import {
	GetAccountsRequest,

} from '../../protos_ts/users';

import {
	UsersServiceClient
} from '../../protos_ts/users.client';

import moment from 'moment';

import {Timestamp} from '../../protos_ts/google/protobuf/timestamp';

import {grpcTransport} from '../auth/connection';

import {_stringify} from '../utils/json';

const get_accounts = async () => {
    const usersServiceClient = new UsersServiceClient(grpcTransport());
    const getAccountsRequest = GetAccountsRequest.create();
    
    console.log(await usersServiceClient.getAccounts(getAccountsRequest).response)
}
get_accounts();