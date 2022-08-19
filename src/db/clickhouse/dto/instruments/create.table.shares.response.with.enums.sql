CREATE TABLE IF NOT EXISTS shares111 (
    figi String,
    ticker String,
    classCode LowCardinality(String),
    isin String,
    lot Int32,
    currency LowCardinality(String),
    klong Nested(units Int64,nano Int32),
    kshort Nested(units Int64,nano Int32),
    dlong Nested(units Int64,nano Int32),
    dshort Nested(units Int64,nano Int32),
    dlongMin Nested(units Int64,nano Int32),
    dshortMin Nested(units Int64,nano Int32),
    shortEnabledFlag Bool,
    name String,
    exchange LowCardinality(String),
    ipoDate Nested(seconds Int64,nano Int32),
    issueSize Int64,
    countryOfRisk LowCardinality(String),
    countryOfRiskName LowCardinality(String),
    sector LowCardinality(String),
    issueSizePlan Int64,
    nominal Nested(currency String,units Int64,nano Int32),
    tradingStatus Enum ('SECURITY_TRADING_STATUS_UNSPECIFIED'=0, 'SECURITY_TRADING_STATUS_NOT_AVAILABLE_FOR_TRADING'=1, 'SECURITY_TRADING_STATUS_OPENING_PERIOD'=2, 'SECURITY_TRADING_STATUS_CLOSING_PERIOD'=3, 'SECURITY_TRADING_STATUS_BREAK_IN_TRADING'=4, 'SECURITY_TRADING_STATUS_NORMAL_TRADING'=5, 'SECURITY_TRADING_STATUS_CLOSING_AUCTION'=6, 'SECURITY_TRADING_STATUS_DARK_POOL_AUCTION'=7, 'SECURITY_TRADING_STATUS_DISCRETE_AUCTION'=8, 'SECURITY_TRADING_STATUS_OPENING_AUCTION_PERIOD'=9, 'SECURITY_TRADING_STATUS_TRADING_AT_CLOSING_AUCTION_PRICE'=10, 'SECURITY_TRADING_STATUS_SESSION_ASSIGNED'=11, 'SECURITY_TRADING_STATUS_SESSION_CLOSE'=12, 'SECURITY_TRADING_STATUS_SESSION_OPEN'=13, 'SECURITY_TRADING_STATUS_DEALER_NORMAL_TRADING'=14, 'SECURITY_TRADING_STATUS_DEALER_BREAK_IN_TRADING'=15, 'SECURITY_TRADING_STATUS_DEALER_NOT_AVAILABLE_FOR_TRADING'=16, 'UNRECOGNIZED'=-1),
    otcFlag Bool,
    buyAvailableFlag Bool,
    sellAvailableFlag Bool,
    divYieldFlag Bool,
    shareType Enum ('SHARE_TYPE_UNSPECIFIED'=0, 'SHARE_TYPE_COMMON'=1, 'SHARE_TYPE_PREFERRED'=2, 'SHARE_TYPE_ADR'=3, 'SHARE_TYPE_GDR'=4, 'SHARE_TYPE_MLP'=5, 'SHARE_TYPE_NY_REG_SHRS'=6, 'SHARE_TYPE_CLOSED_END_FUND'=7, 'SHARE_TYPE_REIT'=8, 'UNRECOGNIZED'=-1),
    minPriceIncrement Nested(units Int64,nano Int32),
    apiTradeAvailableFlag Bool,
    uid String,
    realExchange Enum ('REAL_EXCHANGE_UNSPECIFIED'=0, 'REAL_EXCHANGE_MOEX'=1, 'REAL_EXCHANGE_RTS'=2, 'REAL_EXCHANGE_OTC'=3, 'UNRECOGNIZED'=-1)
) ENGINE = MergeTree() ORDER BY tuple();

