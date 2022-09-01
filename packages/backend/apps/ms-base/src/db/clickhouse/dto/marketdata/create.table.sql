CREATE TABLE IF NOT EXISTS GetCandles
(
    ticker LowCardinality(String),
    figi LowCardinality(String),
    open Nested(units Int64,nano Int32),
    high Nested(units Int64,nano Int32),
    low Nested(units Int64,nano Int32),
    close Nested(units Int64,nano Int32),
    volume Int64,
    time DateTime,
    isComplete Bool,
    tf Int8
) ENGINE = MergeTree() ORDER BY tuple();