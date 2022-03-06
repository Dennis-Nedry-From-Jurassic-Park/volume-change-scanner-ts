// @generated by protobuf-ts 2.2.2 with parameter generate_dependencies
// @generated from protobuf file "stoporders.proto" (package "tinkoff.public.invest.api.contract.v1", syntax proto3)
// tslint:disable
import { ServiceType } from '@protobuf-ts/runtime-rpc';
import type { BinaryWriteOptions } from '@protobuf-ts/runtime';
import type { IBinaryWriter } from '@protobuf-ts/runtime';
import { WireType } from '@protobuf-ts/runtime';
import type { BinaryReadOptions } from '@protobuf-ts/runtime';
import type { IBinaryReader } from '@protobuf-ts/runtime';
import { UnknownFieldHandler } from '@protobuf-ts/runtime';
import type { PartialMessage } from '@protobuf-ts/runtime';
import { reflectionMergePartial } from '@protobuf-ts/runtime';
import { MESSAGE_TYPE } from '@protobuf-ts/runtime';
import { MessageType } from '@protobuf-ts/runtime';
import { MoneyValue } from './common';
import { Timestamp } from './google/protobuf/timestamp';
import { Quotation } from './common';
/**
 * Запрос выставления стоп-заявки
 *
 * @generated from protobuf message tinkoff.public.invest.api.contract.v1.PostStopOrderRequest
 */
export interface PostStopOrderRequest {
    /**
     * @generated from protobuf field: string figi = 1;
     */
    figi: string; // Figi-идентификатор инструмента
    /**
     * @generated from protobuf field: int64 quantity = 2;
     */
    quantity: bigint; // Количество лотов
    /**
     * @generated from protobuf field: tinkoff.public.invest.api.contract.v1.Quotation price = 3;
     */
    price?: Quotation; // Цена лота
    /**
     * @generated from protobuf field: tinkoff.public.invest.api.contract.v1.Quotation stop_price = 4;
     */
    stopPrice?: Quotation; // Стоп-цена заявки
    /**
     * @generated from protobuf field: tinkoff.public.invest.api.contract.v1.StopOrderDirection direction = 5;
     */
    direction: StopOrderDirection; // Направление операции
    /**
     * @generated from protobuf field: string account_id = 6;
     */
    accountId: string; // Номер счёта
    /**
     * @generated from protobuf field: tinkoff.public.invest.api.contract.v1.StopOrderExpirationType expiration_type = 7;
     */
    expirationType: StopOrderExpirationType; // Тип экспирации заявки
    /**
     * @generated from protobuf field: tinkoff.public.invest.api.contract.v1.StopOrderType stop_order_type = 8;
     */
    stopOrderType: StopOrderType; // Тип заявки
    /**
     * @generated from protobuf field: google.protobuf.Timestamp expire_date = 9;
     */
    expireDate?: Timestamp; // Дата и время окончания действия стоп-заявки в часовом поясе UTC. **Для ExpirationType = GoodTillDate заполнение обязательно**.
}
/**
 * Результат выставления стоп-заявки.
 *
 * @generated from protobuf message tinkoff.public.invest.api.contract.v1.PostStopOrderResponse
 */
export interface PostStopOrderResponse {
    /**
     * @generated from protobuf field: string stop_order_id = 1;
     */
    stopOrderId: string; // Уникальный идентификатор стоп-заявки.
}
/**
 * Запрос получения списка активных стоп-заявок.
 *
 * @generated from protobuf message tinkoff.public.invest.api.contract.v1.GetStopOrdersRequest
 */
export interface GetStopOrdersRequest {
    /**
     * @generated from protobuf field: string account_id = 1;
     */
    accountId: string; // Идентификатор счёта клиента
}
/**
 * Список активных стоп-заявок.
 *
 * @generated from protobuf message tinkoff.public.invest.api.contract.v1.GetStopOrdersResponse
 */
export interface GetStopOrdersResponse {
    /**
     * @generated from protobuf field: repeated tinkoff.public.invest.api.contract.v1.StopOrder stop_orders = 1;
     */
    stopOrders: StopOrder[]; // Массив стоп-заявок по счёту
}
/**
 * Запрос отмены выставленной стоп-заявки.
 *
 * @generated from protobuf message tinkoff.public.invest.api.contract.v1.CancelStopOrderRequest
 */
export interface CancelStopOrderRequest {
    /**
     * @generated from protobuf field: string account_id = 1;
     */
    accountId: string; // Идентификатор счёта клиента
    /**
     * @generated from protobuf field: string stop_order_id = 2;
     */
    stopOrderId: string; // Уникальный идентификатор стоп-заявки.
}
/**
 * Результат отмены выставленной стоп-заявки.
 *
 * @generated from protobuf message tinkoff.public.invest.api.contract.v1.CancelStopOrderResponse
 */
export interface CancelStopOrderResponse {
    /**
     * @generated from protobuf field: google.protobuf.Timestamp time = 1;
     */
    time?: Timestamp; // Время отмены заявки в часовом поясе UTC.
}
/**
 * Информация о стоп-заявке.
 *
 * @generated from protobuf message tinkoff.public.invest.api.contract.v1.StopOrder
 */
export interface StopOrder {
    /**
     * @generated from protobuf field: string stop_order_id = 1;
     */
    stopOrderId: string; // Идентификатор-идентификатор стоп-заявки
    /**
     * @generated from protobuf field: int64 lots_requested = 2;
     */
    lotsRequested: bigint; // Запрошено лотов
    /**
     * @generated from protobuf field: string figi = 3;
     */
    figi: string; // Figi-идентификатор инструмента
    /**
     * @generated from protobuf field: tinkoff.public.invest.api.contract.v1.StopOrderDirection direction = 4;
     */
    direction: StopOrderDirection; // Направление операции
    /**
     * @generated from protobuf field: string currency = 5;
     */
    currency: string; // Валюта стоп-заявки
    /**
     * @generated from protobuf field: tinkoff.public.invest.api.contract.v1.StopOrderType order_type = 6;
     */
    orderType: StopOrderType; // Тип стоп-заявки
    /**
     * @generated from protobuf field: google.protobuf.Timestamp create_date = 7;
     */
    createDate?: Timestamp; // Дата и время выставления заявки в часовом поясе UTC.
    /**
     * @generated from protobuf field: google.protobuf.Timestamp activation_date_time = 8;
     */
    activationDateTime?: Timestamp; // Дата и время конвертации стоп-заявки в биржевую в часовом поясе UTC.
    /**
     * @generated from protobuf field: google.protobuf.Timestamp expiration_time = 9;
     */
    expirationTime?: Timestamp; // Дата и время снятия заявки в часовом поясе UTC.
    /**
     * @generated from protobuf field: tinkoff.public.invest.api.contract.v1.MoneyValue price = 10;
     */
    price?: MoneyValue; // Цена заявки
    /**
     * @generated from protobuf field: tinkoff.public.invest.api.contract.v1.MoneyValue stop_price = 11;
     */
    stopPrice?: MoneyValue; // Цена активации стоп-заявки
}
/**
 * Направление сделки стоп-заявки.
 *
 * @generated from protobuf enum tinkoff.public.invest.api.contract.v1.StopOrderDirection
 */
export enum StopOrderDirection {
    /**
     * Значение не указано
     *
     * @generated from protobuf enum value: STOP_ORDER_DIRECTION_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Покупка
     *
     * @generated from protobuf enum value: STOP_ORDER_DIRECTION_BUY = 1;
     */
    BUY = 1,
    /**
     * Продажа
     *
     * @generated from protobuf enum value: STOP_ORDER_DIRECTION_SELL = 2;
     */
    SELL = 2
}
/**
 * Тип экспирации стоп-заявке.
 *
 * @generated from protobuf enum tinkoff.public.invest.api.contract.v1.StopOrderExpirationType
 */
export enum StopOrderExpirationType {
    /**
     * Значение не указано.
     *
     * @generated from protobuf enum value: STOP_ORDER_EXPIRATION_TYPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Действительно до отмены.
     *
     * @generated from protobuf enum value: STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_CANCEL = 1;
     */
    GOOD_TILL_CANCEL = 1,
    /**
     * Действительно до даты снятия.
     *
     * @generated from protobuf enum value: STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_DATE = 2;
     */
    GOOD_TILL_DATE = 2
}
/**
 * Тип стоп-заявки.
 *
 * @generated from protobuf enum tinkoff.public.invest.api.contract.v1.StopOrderType
 */
export enum StopOrderType {
    /**
     * Значение не указано
     *
     * @generated from protobuf enum value: STOP_ORDER_TYPE_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Take-profit заявка
     *
     * @generated from protobuf enum value: STOP_ORDER_TYPE_TAKE_PROFIT = 1;
     */
    TAKE_PROFIT = 1,
    /**
     * Stop-loss заявка
     *
     * @generated from protobuf enum value: STOP_ORDER_TYPE_STOP_LOSS = 2;
     */
    STOP_LOSS = 2,
    /**
     * Stop-limit заявка
     *
     * @generated from protobuf enum value: STOP_ORDER_TYPE_STOP_LIMIT = 3;
     */
    STOP_LIMIT = 3
}
// @generated message type with reflection information, may provide speed optimized methods
class PostStopOrderRequest$Type extends MessageType<PostStopOrderRequest> {
	constructor() {
		super('tinkoff.public.invest.api.contract.v1.PostStopOrderRequest', [
			{ no: 1, name: 'figi', kind: 'scalar', T: 9 /*ScalarType.STRING*/ },
			{ no: 2, name: 'quantity', kind: 'scalar', T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
			{ no: 3, name: 'price', kind: 'message', T: () => Quotation },
			{ no: 4, name: 'stop_price', kind: 'message', T: () => Quotation },
			{ no: 5, name: 'direction', kind: 'enum', T: () => ['tinkoff.public.invest.api.contract.v1.StopOrderDirection', StopOrderDirection, 'STOP_ORDER_DIRECTION_'] },
			{ no: 6, name: 'account_id', kind: 'scalar', T: 9 /*ScalarType.STRING*/ },
			{ no: 7, name: 'expiration_type', kind: 'enum', T: () => ['tinkoff.public.invest.api.contract.v1.StopOrderExpirationType', StopOrderExpirationType, 'STOP_ORDER_EXPIRATION_TYPE_'] },
			{ no: 8, name: 'stop_order_type', kind: 'enum', T: () => ['tinkoff.public.invest.api.contract.v1.StopOrderType', StopOrderType, 'STOP_ORDER_TYPE_'] },
			{ no: 9, name: 'expire_date', kind: 'message', T: () => Timestamp }
		]);
	}
	create(value?: PartialMessage<PostStopOrderRequest>): PostStopOrderRequest {
		const message = { figi: '', quantity: 0n, direction: 0, accountId: '', expirationType: 0, stopOrderType: 0 };
		globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
		if (value !== undefined)
			reflectionMergePartial<PostStopOrderRequest>(this, message, value);
		return message;
	}
	internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PostStopOrderRequest): PostStopOrderRequest {
		const message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			const [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
			case /* string figi */ 1:
				message.figi = reader.string();
				break;
			case /* int64 quantity */ 2:
				message.quantity = reader.int64().toBigInt();
				break;
			case /* tinkoff.public.invest.api.contract.v1.Quotation price */ 3:
				message.price = Quotation.internalBinaryRead(reader, reader.uint32(), options, message.price);
				break;
			case /* tinkoff.public.invest.api.contract.v1.Quotation stop_price */ 4:
				message.stopPrice = Quotation.internalBinaryRead(reader, reader.uint32(), options, message.stopPrice);
				break;
			case /* tinkoff.public.invest.api.contract.v1.StopOrderDirection direction */ 5:
				message.direction = reader.int32();
				break;
			case /* string account_id */ 6:
				message.accountId = reader.string();
				break;
			case /* tinkoff.public.invest.api.contract.v1.StopOrderExpirationType expiration_type */ 7:
				message.expirationType = reader.int32();
				break;
			case /* tinkoff.public.invest.api.contract.v1.StopOrderType stop_order_type */ 8:
				message.stopOrderType = reader.int32();
				break;
			case /* google.protobuf.Timestamp expire_date */ 9:
				message.expireDate = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.expireDate);
				break;
			default:
				const u = options.readUnknownField;
				if (u === 'throw')
					throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
				const d = reader.skip(wireType);
				if (u !== false)
					(u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message: PostStopOrderRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
		/* string figi = 1; */
		if (message.figi !== '')
			writer.tag(1, WireType.LengthDelimited).string(message.figi);
		/* int64 quantity = 2; */
		if (message.quantity !== 0n)
			writer.tag(2, WireType.Varint).int64(message.quantity);
		/* tinkoff.public.invest.api.contract.v1.Quotation price = 3; */
		if (message.price)
			Quotation.internalBinaryWrite(message.price, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
		/* tinkoff.public.invest.api.contract.v1.Quotation stop_price = 4; */
		if (message.stopPrice)
			Quotation.internalBinaryWrite(message.stopPrice, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
		/* tinkoff.public.invest.api.contract.v1.StopOrderDirection direction = 5; */
		if (message.direction !== 0)
			writer.tag(5, WireType.Varint).int32(message.direction);
		/* string account_id = 6; */
		if (message.accountId !== '')
			writer.tag(6, WireType.LengthDelimited).string(message.accountId);
		/* tinkoff.public.invest.api.contract.v1.StopOrderExpirationType expiration_type = 7; */
		if (message.expirationType !== 0)
			writer.tag(7, WireType.Varint).int32(message.expirationType);
		/* tinkoff.public.invest.api.contract.v1.StopOrderType stop_order_type = 8; */
		if (message.stopOrderType !== 0)
			writer.tag(8, WireType.Varint).int32(message.stopOrderType);
		/* google.protobuf.Timestamp expire_date = 9; */
		if (message.expireDate)
			Timestamp.internalBinaryWrite(message.expireDate, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
		const u = options.writeUnknownFields;
		if (u !== false)
			(u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
/**
 * @generated MessageType for protobuf message tinkoff.public.invest.api.contract.v1.PostStopOrderRequest
 */
export const PostStopOrderRequest = new PostStopOrderRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class PostStopOrderResponse$Type extends MessageType<PostStopOrderResponse> {
	constructor() {
		super('tinkoff.public.invest.api.contract.v1.PostStopOrderResponse', [
			{ no: 1, name: 'stop_order_id', kind: 'scalar', T: 9 /*ScalarType.STRING*/ }
		]);
	}
	create(value?: PartialMessage<PostStopOrderResponse>): PostStopOrderResponse {
		const message = { stopOrderId: '' };
		globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
		if (value !== undefined)
			reflectionMergePartial<PostStopOrderResponse>(this, message, value);
		return message;
	}
	internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PostStopOrderResponse): PostStopOrderResponse {
		const message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			const [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
			case /* string stop_order_id */ 1:
				message.stopOrderId = reader.string();
				break;
			default:
				const u = options.readUnknownField;
				if (u === 'throw')
					throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
				const d = reader.skip(wireType);
				if (u !== false)
					(u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message: PostStopOrderResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
		/* string stop_order_id = 1; */
		if (message.stopOrderId !== '')
			writer.tag(1, WireType.LengthDelimited).string(message.stopOrderId);
		const u = options.writeUnknownFields;
		if (u !== false)
			(u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
/**
 * @generated MessageType for protobuf message tinkoff.public.invest.api.contract.v1.PostStopOrderResponse
 */
export const PostStopOrderResponse = new PostStopOrderResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetStopOrdersRequest$Type extends MessageType<GetStopOrdersRequest> {
	constructor() {
		super('tinkoff.public.invest.api.contract.v1.GetStopOrdersRequest', [
			{ no: 1, name: 'account_id', kind: 'scalar', T: 9 /*ScalarType.STRING*/ }
		]);
	}
	create(value?: PartialMessage<GetStopOrdersRequest>): GetStopOrdersRequest {
		const message = { accountId: '' };
		globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
		if (value !== undefined)
			reflectionMergePartial<GetStopOrdersRequest>(this, message, value);
		return message;
	}
	internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStopOrdersRequest): GetStopOrdersRequest {
		const message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			const [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
			case /* string account_id */ 1:
				message.accountId = reader.string();
				break;
			default:
				const u = options.readUnknownField;
				if (u === 'throw')
					throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
				const d = reader.skip(wireType);
				if (u !== false)
					(u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message: GetStopOrdersRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
		/* string account_id = 1; */
		if (message.accountId !== '')
			writer.tag(1, WireType.LengthDelimited).string(message.accountId);
		const u = options.writeUnknownFields;
		if (u !== false)
			(u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
/**
 * @generated MessageType for protobuf message tinkoff.public.invest.api.contract.v1.GetStopOrdersRequest
 */
export const GetStopOrdersRequest = new GetStopOrdersRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetStopOrdersResponse$Type extends MessageType<GetStopOrdersResponse> {
	constructor() {
		super('tinkoff.public.invest.api.contract.v1.GetStopOrdersResponse', [
			{ no: 1, name: 'stop_orders', kind: 'message', repeat: 1 /*RepeatType.PACKED*/, T: () => StopOrder }
		]);
	}
	create(value?: PartialMessage<GetStopOrdersResponse>): GetStopOrdersResponse {
		const message = { stopOrders: [] };
		globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
		if (value !== undefined)
			reflectionMergePartial<GetStopOrdersResponse>(this, message, value);
		return message;
	}
	internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetStopOrdersResponse): GetStopOrdersResponse {
		const message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			const [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
			case /* repeated tinkoff.public.invest.api.contract.v1.StopOrder stop_orders */ 1:
				message.stopOrders.push(StopOrder.internalBinaryRead(reader, reader.uint32(), options));
				break;
			default:
				const u = options.readUnknownField;
				if (u === 'throw')
					throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
				const d = reader.skip(wireType);
				if (u !== false)
					(u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message: GetStopOrdersResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
		/* repeated tinkoff.public.invest.api.contract.v1.StopOrder stop_orders = 1; */
		for (let i = 0; i < message.stopOrders.length; i++)
			StopOrder.internalBinaryWrite(message.stopOrders[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		const u = options.writeUnknownFields;
		if (u !== false)
			(u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
/**
 * @generated MessageType for protobuf message tinkoff.public.invest.api.contract.v1.GetStopOrdersResponse
 */
export const GetStopOrdersResponse = new GetStopOrdersResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CancelStopOrderRequest$Type extends MessageType<CancelStopOrderRequest> {
	constructor() {
		super('tinkoff.public.invest.api.contract.v1.CancelStopOrderRequest', [
			{ no: 1, name: 'account_id', kind: 'scalar', T: 9 /*ScalarType.STRING*/ },
			{ no: 2, name: 'stop_order_id', kind: 'scalar', T: 9 /*ScalarType.STRING*/ }
		]);
	}
	create(value?: PartialMessage<CancelStopOrderRequest>): CancelStopOrderRequest {
		const message = { accountId: '', stopOrderId: '' };
		globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
		if (value !== undefined)
			reflectionMergePartial<CancelStopOrderRequest>(this, message, value);
		return message;
	}
	internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CancelStopOrderRequest): CancelStopOrderRequest {
		const message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			const [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
			case /* string account_id */ 1:
				message.accountId = reader.string();
				break;
			case /* string stop_order_id */ 2:
				message.stopOrderId = reader.string();
				break;
			default:
				const u = options.readUnknownField;
				if (u === 'throw')
					throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
				const d = reader.skip(wireType);
				if (u !== false)
					(u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message: CancelStopOrderRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
		/* string account_id = 1; */
		if (message.accountId !== '')
			writer.tag(1, WireType.LengthDelimited).string(message.accountId);
		/* string stop_order_id = 2; */
		if (message.stopOrderId !== '')
			writer.tag(2, WireType.LengthDelimited).string(message.stopOrderId);
		const u = options.writeUnknownFields;
		if (u !== false)
			(u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
/**
 * @generated MessageType for protobuf message tinkoff.public.invest.api.contract.v1.CancelStopOrderRequest
 */
export const CancelStopOrderRequest = new CancelStopOrderRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CancelStopOrderResponse$Type extends MessageType<CancelStopOrderResponse> {
	constructor() {
		super('tinkoff.public.invest.api.contract.v1.CancelStopOrderResponse', [
			{ no: 1, name: 'time', kind: 'message', T: () => Timestamp }
		]);
	}
	create(value?: PartialMessage<CancelStopOrderResponse>): CancelStopOrderResponse {
		const message = {};
		globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
		if (value !== undefined)
			reflectionMergePartial<CancelStopOrderResponse>(this, message, value);
		return message;
	}
	internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CancelStopOrderResponse): CancelStopOrderResponse {
		const message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			const [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
			case /* google.protobuf.Timestamp time */ 1:
				message.time = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.time);
				break;
			default:
				const u = options.readUnknownField;
				if (u === 'throw')
					throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
				const d = reader.skip(wireType);
				if (u !== false)
					(u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message: CancelStopOrderResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
		/* google.protobuf.Timestamp time = 1; */
		if (message.time)
			Timestamp.internalBinaryWrite(message.time, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
		const u = options.writeUnknownFields;
		if (u !== false)
			(u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
/**
 * @generated MessageType for protobuf message tinkoff.public.invest.api.contract.v1.CancelStopOrderResponse
 */
export const CancelStopOrderResponse = new CancelStopOrderResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class StopOrder$Type extends MessageType<StopOrder> {
	constructor() {
		super('tinkoff.public.invest.api.contract.v1.StopOrder', [
			{ no: 1, name: 'stop_order_id', kind: 'scalar', T: 9 /*ScalarType.STRING*/ },
			{ no: 2, name: 'lots_requested', kind: 'scalar', T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
			{ no: 3, name: 'figi', kind: 'scalar', T: 9 /*ScalarType.STRING*/ },
			{ no: 4, name: 'direction', kind: 'enum', T: () => ['tinkoff.public.invest.api.contract.v1.StopOrderDirection', StopOrderDirection, 'STOP_ORDER_DIRECTION_'] },
			{ no: 5, name: 'currency', kind: 'scalar', T: 9 /*ScalarType.STRING*/ },
			{ no: 6, name: 'order_type', kind: 'enum', T: () => ['tinkoff.public.invest.api.contract.v1.StopOrderType', StopOrderType, 'STOP_ORDER_TYPE_'] },
			{ no: 7, name: 'create_date', kind: 'message', T: () => Timestamp },
			{ no: 8, name: 'activation_date_time', kind: 'message', T: () => Timestamp },
			{ no: 9, name: 'expiration_time', kind: 'message', T: () => Timestamp },
			{ no: 10, name: 'price', kind: 'message', T: () => MoneyValue },
			{ no: 11, name: 'stop_price', kind: 'message', T: () => MoneyValue }
		]);
	}
	create(value?: PartialMessage<StopOrder>): StopOrder {
		const message = { stopOrderId: '', lotsRequested: 0n, figi: '', direction: 0, currency: '', orderType: 0 };
		globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
		if (value !== undefined)
			reflectionMergePartial<StopOrder>(this, message, value);
		return message;
	}
	internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StopOrder): StopOrder {
		const message = target ?? this.create(), end = reader.pos + length;
		while (reader.pos < end) {
			const [fieldNo, wireType] = reader.tag();
			switch (fieldNo) {
			case /* string stop_order_id */ 1:
				message.stopOrderId = reader.string();
				break;
			case /* int64 lots_requested */ 2:
				message.lotsRequested = reader.int64().toBigInt();
				break;
			case /* string figi */ 3:
				message.figi = reader.string();
				break;
			case /* tinkoff.public.invest.api.contract.v1.StopOrderDirection direction */ 4:
				message.direction = reader.int32();
				break;
			case /* string currency */ 5:
				message.currency = reader.string();
				break;
			case /* tinkoff.public.invest.api.contract.v1.StopOrderType order_type */ 6:
				message.orderType = reader.int32();
				break;
			case /* google.protobuf.Timestamp create_date */ 7:
				message.createDate = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.createDate);
				break;
			case /* google.protobuf.Timestamp activation_date_time */ 8:
				message.activationDateTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.activationDateTime);
				break;
			case /* google.protobuf.Timestamp expiration_time */ 9:
				message.expirationTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.expirationTime);
				break;
			case /* tinkoff.public.invest.api.contract.v1.MoneyValue price */ 10:
				message.price = MoneyValue.internalBinaryRead(reader, reader.uint32(), options, message.price);
				break;
			case /* tinkoff.public.invest.api.contract.v1.MoneyValue stop_price */ 11:
				message.stopPrice = MoneyValue.internalBinaryRead(reader, reader.uint32(), options, message.stopPrice);
				break;
			default:
				const u = options.readUnknownField;
				if (u === 'throw')
					throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
				const d = reader.skip(wireType);
				if (u !== false)
					(u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
			}
		}
		return message;
	}
	internalBinaryWrite(message: StopOrder, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
		/* string stop_order_id = 1; */
		if (message.stopOrderId !== '')
			writer.tag(1, WireType.LengthDelimited).string(message.stopOrderId);
		/* int64 lots_requested = 2; */
		if (message.lotsRequested !== 0n)
			writer.tag(2, WireType.Varint).int64(message.lotsRequested);
		/* string figi = 3; */
		if (message.figi !== '')
			writer.tag(3, WireType.LengthDelimited).string(message.figi);
		/* tinkoff.public.invest.api.contract.v1.StopOrderDirection direction = 4; */
		if (message.direction !== 0)
			writer.tag(4, WireType.Varint).int32(message.direction);
		/* string currency = 5; */
		if (message.currency !== '')
			writer.tag(5, WireType.LengthDelimited).string(message.currency);
		/* tinkoff.public.invest.api.contract.v1.StopOrderType order_type = 6; */
		if (message.orderType !== 0)
			writer.tag(6, WireType.Varint).int32(message.orderType);
		/* google.protobuf.Timestamp create_date = 7; */
		if (message.createDate)
			Timestamp.internalBinaryWrite(message.createDate, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
		/* google.protobuf.Timestamp activation_date_time = 8; */
		if (message.activationDateTime)
			Timestamp.internalBinaryWrite(message.activationDateTime, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
		/* google.protobuf.Timestamp expiration_time = 9; */
		if (message.expirationTime)
			Timestamp.internalBinaryWrite(message.expirationTime, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
		/* tinkoff.public.invest.api.contract.v1.MoneyValue price = 10; */
		if (message.price)
			MoneyValue.internalBinaryWrite(message.price, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
		/* tinkoff.public.invest.api.contract.v1.MoneyValue stop_price = 11; */
		if (message.stopPrice)
			MoneyValue.internalBinaryWrite(message.stopPrice, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
		const u = options.writeUnknownFields;
		if (u !== false)
			(u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
		return writer;
	}
}
/**
 * @generated MessageType for protobuf message tinkoff.public.invest.api.contract.v1.StopOrder
 */
export const StopOrder = new StopOrder$Type();
/**
 * @generated ServiceType for protobuf service tinkoff.public.invest.api.contract.v1.StopOrdersService
 */
export const StopOrdersService = new ServiceType('tinkoff.public.invest.api.contract.v1.StopOrdersService', [
	{ name: 'PostStopOrder', options: {}, I: PostStopOrderRequest, O: PostStopOrderResponse },
	{ name: 'GetStopOrders', options: {}, I: GetStopOrdersRequest, O: GetStopOrdersResponse },
	{ name: 'CancelStopOrder', options: {}, I: CancelStopOrderRequest, O: CancelStopOrderResponse }
]);
