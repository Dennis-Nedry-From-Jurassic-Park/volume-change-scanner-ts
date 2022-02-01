// @generated by protobuf-ts 2.2.2 with parameter generate_dependencies
// @generated from protobuf file "common.proto" (package "tinkoff.public.invest.api.contract.v1", syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Timestamp } from "./google/protobuf/timestamp";
/**
 * Денежная сумма в определенной валюте
 *
 * @generated from protobuf message tinkoff.public.invest.api.contract.v1.MoneyValue
 */
export interface MoneyValue {
    /**
     * строковый ISO-код валюты
     *
     * @generated from protobuf field: string currency = 1;
     */
    currency: string;
    /**
     * целая часть суммы, может быть отрицательным числом
     *
     * @generated from protobuf field: int64 units = 2;
     */
    units: bigint;
    /**
     * дробная часть суммы, может быть отрицательным числом
     *
     * @generated from protobuf field: int32 nano = 3;
     */
    nano: number;
}
/**
 * Котировка - денежная сумма без указания валюты
 *
 * @generated from protobuf message tinkoff.public.invest.api.contract.v1.Quotation
 */
export interface Quotation {
    /**
     * целая часть суммы, может быть отрицательным числом
     *
     * @generated from protobuf field: int64 units = 1;
     */
    units: bigint;
    /**
     * дробная часть суммы, может быть отрицательным числом
     *
     * @generated from protobuf field: int32 nano = 2;
     */
    nano: number;
}
/**
 * Проверка активности стрима.
 *
 * @generated from protobuf message tinkoff.public.invest.api.contract.v1.Ping
 */
export interface Ping {
    /**
     * Время проверки.
     *
     * @generated from protobuf field: google.protobuf.Timestamp time = 1;
     */
    time?: Timestamp;
}
/**
 * Режим торгов инструмента
 *
 * @generated from protobuf enum tinkoff.public.invest.api.contract.v1.SecurityTradingStatus
 */
export enum SecurityTradingStatus {
    /**
     * Торговый статус не определён
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * Недоступен для торгов
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_NOT_AVAILABLE_FOR_TRADING = 1;
     */
    NOT_AVAILABLE_FOR_TRADING = 1,
    /**
     * Период открытия торгов
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_OPENING_PERIOD = 2;
     */
    OPENING_PERIOD = 2,
    /**
     * Период закрытия торгов
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_CLOSING_PERIOD = 3;
     */
    CLOSING_PERIOD = 3,
    /**
     * Перерыв в торговле
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_BREAK_IN_TRADING = 4;
     */
    BREAK_IN_TRADING = 4,
    /**
     * Нормальная торговля
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_NORMAL_TRADING = 5;
     */
    NORMAL_TRADING = 5,
    /**
     * Аукцион закрытия
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_CLOSING_AUCTION = 6;
     */
    CLOSING_AUCTION = 6,
    /**
     * Аукцион крупных пакетов
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_DARK_POOL_AUCTION = 7;
     */
    DARK_POOL_AUCTION = 7,
    /**
     * Дискретный аукцион
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_DISCRETE_AUCTION = 8;
     */
    DISCRETE_AUCTION = 8,
    /**
     * Аукцион открытия
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_OPENING_AUCTION_PERIOD = 9;
     */
    OPENING_AUCTION_PERIOD = 9,
    /**
     * Период торгов по цене аукциона закрытия
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_TRADING_AT_CLOSING_AUCTION_PRICE = 10;
     */
    TRADING_AT_CLOSING_AUCTION_PRICE = 10,
    /**
     * Сессия назначена
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_SESSION_ASSIGNED = 11;
     */
    SESSION_ASSIGNED = 11,
    /**
     * Сессия закрыта
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_SESSION_CLOSE = 12;
     */
    SESSION_CLOSE = 12,
    /**
     * Сессия открыта
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_SESSION_OPEN = 13;
     */
    SESSION_OPEN = 13,
    /**
     * Доступна торговля в режиме внутренней ликвидности брокера
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_DEALER_NORMAL_TRADING = 14;
     */
    DEALER_NORMAL_TRADING = 14,
    /**
     * Перерыв торговли в режиме внутренней ликвидности брокера
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_DEALER_BREAK_IN_TRADING = 15;
     */
    DEALER_BREAK_IN_TRADING = 15,
    /**
     * Недоступна торговля в режиме внутренней ликвидности брокера
     *
     * @generated from protobuf enum value: SECURITY_TRADING_STATUS_DEALER_NOT_AVAILABLE_FOR_TRADING = 16;
     */
    DEALER_NOT_AVAILABLE_FOR_TRADING = 16
}
// @generated message type with reflection information, may provide speed optimized methods
class MoneyValue$Type extends MessageType<MoneyValue> {
    constructor() {
        super("tinkoff.public.invest.api.contract.v1.MoneyValue", [
            { no: 1, name: "currency", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "units", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 3, name: "nano", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<MoneyValue>): MoneyValue {
        const message = { currency: "", units: 0n, nano: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<MoneyValue>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MoneyValue): MoneyValue {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string currency */ 1:
                    message.currency = reader.string();
                    break;
                case /* int64 units */ 2:
                    message.units = reader.int64().toBigInt();
                    break;
                case /* int32 nano */ 3:
                    message.nano = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: MoneyValue, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string currency = 1; */
        if (message.currency !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.currency);
        /* int64 units = 2; */
        if (message.units !== 0n)
            writer.tag(2, WireType.Varint).int64(message.units);
        /* int32 nano = 3; */
        if (message.nano !== 0)
            writer.tag(3, WireType.Varint).int32(message.nano);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message tinkoff.public.invest.api.contract.v1.MoneyValue
 */
export const MoneyValue = new MoneyValue$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Quotation$Type extends MessageType<Quotation> {
    constructor() {
        super("tinkoff.public.invest.api.contract.v1.Quotation", [
            { no: 1, name: "units", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 2, name: "nano", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<Quotation>): Quotation {
        const message = { units: 0n, nano: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Quotation>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Quotation): Quotation {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 units */ 1:
                    message.units = reader.int64().toBigInt();
                    break;
                case /* int32 nano */ 2:
                    message.nano = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Quotation, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int64 units = 1; */
        if (message.units !== 0n)
            writer.tag(1, WireType.Varint).int64(message.units);
        /* int32 nano = 2; */
        if (message.nano !== 0)
            writer.tag(2, WireType.Varint).int32(message.nano);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message tinkoff.public.invest.api.contract.v1.Quotation
 */
export const Quotation = new Quotation$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Ping$Type extends MessageType<Ping> {
    constructor() {
        super("tinkoff.public.invest.api.contract.v1.Ping", [
            { no: 1, name: "time", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<Ping>): Ping {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Ping>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Ping): Ping {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* google.protobuf.Timestamp time */ 1:
                    message.time = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.time);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Ping, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* google.protobuf.Timestamp time = 1; */
        if (message.time)
            Timestamp.internalBinaryWrite(message.time, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message tinkoff.public.invest.api.contract.v1.Ping
 */
export const Ping = new Ping$Type();
