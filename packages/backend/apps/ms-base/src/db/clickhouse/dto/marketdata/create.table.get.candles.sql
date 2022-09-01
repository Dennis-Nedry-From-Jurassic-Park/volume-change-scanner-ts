CREATE TABLE IF NOT EXISTS GetCandles
(
    ticker LowCardinality(String),
    figi LowCardinality(String),
    open Nested(units Int64,nano Int32),
    high Nested(units Int64,nano Int32),
    low Nested(units Int64,nano Int32),
    close Nested(units Int64,nano Int32),
    volume Int64,
    time Nested(units Int64,nano Int32),
    isComplete Bool
) ENGINE = ReplacingMergeTree() ORDER BY tuple();

CREATE TABLE IF NOT EXISTS GetCandles
(
    ticker LowCardinality(String),
    figi LowCardinality(String),
    open Nested(units Int64,nano Int32),
    high Nested(units Int64,nano Int32),
    low Nested(units Int64,nano Int32),
    close Nested(units Int64,nano Int32),
    volume Int64,
    time Date,
    isComplete Bool,
    tf Int8
) ENGINE = ReplacingMergeTree() ORDER BY tuple();


ALTER TABLE GetCandles ADD COLUMN tf Int8;
ALTER TABLE GetCandles ADD COLUMN time Date;

ALTER TABLE GetCandles MODIFY COLUMN tf LowCardinality(Int8);

DROP TABLE GetCandles


ALTER TABLE GetCandles DROP COLUMN time.units;
ALTER TABLE GetCandles DROP COLUMN time.nano;
ALTER TABLE GetCandles MODIFY COLUMN time Date;
ALTER TABLE GetCandles MODIFY COLUMN isComplete LowCardinality(Int8);