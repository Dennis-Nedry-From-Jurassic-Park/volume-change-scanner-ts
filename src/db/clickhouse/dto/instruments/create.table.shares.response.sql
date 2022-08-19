CREATE TABLE IF NOT EXISTS shares (
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
    tradingStatus Int8,
    otcFlag Bool,
    buyAvailableFlag Bool,
    sellAvailableFlag Bool,
    divYieldFlag Bool,
    shareType Int8,
    minPriceIncrement Nested(units Int64,nano Int32),
    apiTradeAvailableFlag Bool,
    uid String,
    realExchange Int8
) ENGINE = MergeTree() ORDER BY tuple();
