CREATE TABLE IF NOT EXISTS GetCandles2
(
    ticker LowCardinality(String),
    figi LowCardinality(String),
    open Float32,
    high Float32,
    low Float32,
    close Float32,
    volume Int64,
    time DateTime,
    isComplete Bool,
    tf Int8
) ENGINE = MergeTree() ORDER BY tuple();

