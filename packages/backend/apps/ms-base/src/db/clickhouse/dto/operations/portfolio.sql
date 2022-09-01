CREATE DATABASE IF NOT EXISTS operations;

CREATE TABLE IF NOT EXISTS operations.GetPortfolio
(
    time DateTime Codec(DoubleDelta),
    dt Date,
    account_id LowCardinality(String),
    account_name LowCardinality(String),
    currency LowCardinality(String),
    total Float32 CODEC(Gorilla, ZSTD),
    totalAmountCurrencies Float32 CODEC(Gorilla, ZSTD),
    totalAmountShares Float32 CODEC(Gorilla, ZSTD),
    totalAmountBonds Float32 CODEC(Gorilla, ZSTD),
    totalAmountEtf Float32 CODEC(Gorilla, ZSTD),
    account_type Int8 CODEC(T64, ZSTD),
    account_status Int8 CODEC(T64, ZSTD),
    account_accessLevel Int8 CODEC(T64, ZSTD)
) ENGINE = MergeTree() PARTITION BY dt ORDER BY time SETTINGS index_granularity=8192;


CREATE TABLE IF NOT EXISTS operations.GetPortfolio
(
    time DateTime64(3, 'Europe/Moscow') Codec(DoubleDelta),
    dt Date,
    account_id LowCardinality(String),
    account_name LowCardinality(String),
    currency LowCardinality(String),
    total Float32 CODEC(Gorilla, ZSTD),
    totalAmountCurrencies Float32 CODEC(Gorilla, ZSTD),
    totalAmountShares Float32 CODEC(Gorilla, ZSTD),
    totalAmountBonds Float32 CODEC(Gorilla, ZSTD),
    totalAmountEtf Float32 CODEC(Gorilla, ZSTD),
    account_type Int8 CODEC(T64, ZSTD),
    account_status Int8 CODEC(T64, ZSTD),
    account_accessLevel Int8 CODEC(T64, ZSTD)
) ENGINE = MergeTree() PARTITION BY dt ORDER BY time SETTINGS index_granularity=8192;
