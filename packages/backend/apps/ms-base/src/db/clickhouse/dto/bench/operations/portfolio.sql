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
    ts UInt32 Codec(DoubleDelta),
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



-- CREATE DATABASE IF NOT EXISTS operations;
create table test_codec_speed engine=MergeTree
ORDER BY tuple()
as select cast(now() + rand()%2000 + number, 'UInt32') as x from numbers(1000000);



create table test_codec_speed engine=MergeTree
ORDER BY tuple()
as select cast(now() + rand()%2000 + number, 'UInt32') as x from numbers(1000000000);

option 1: CODEC(LZ4) (same as default)
option 2: CODEC(DoubleDelta) (`alter table test_codec_speed modify column x DateTime CODEC(DoubleDelta)`);
option 3: CODEC(T64, LZ4) (`alter table test_codec_speed modify column x DateTime CODEC(T64, LZ4)`)
option 4: CODEC(Delta, LZ4) (`alter table test_codec_speed modify column x DateTime CODEC(Delta, LZ4)`)
option 5: CODEC(ZSTD(1)) (`alter table test_codec_speed modify column x DateTime CODEC(ZSTD(1))`)
option 6: CODEC(T64, ZSTD(1)) (`alter table test_codec_speed modify column x DateTime CODEC(T64, ZSTD(1))`)
option 7: CODEC(Delta, ZSTD(1)) (`alter table test_codec_speed modify column x DateTime CODEC(Delta, ZSTD(1))`)
option 8: CODEC(T64, LZ4HC(1)) (`alter table test_codec_speed modify column x DateTime CODEC(T64, LZ4HC(1))`)
option 9: CODEC(Gorilla) (`alter table test_codec_speed modify column x DateTime CODEC(Gorilla)`)



