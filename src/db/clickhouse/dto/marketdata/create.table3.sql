CREATE DATABASE IF NOT EXISTS marketdata;

CREATE TABLE IF NOT EXISTS GetCandles
(
    ticker LowCardinality(String),
    figi LowCardinality(String),
    open Float32 CODEC(Gorilla, ZSTD),
    high Float32 CODEC(Gorilla, ZSTD),
    low Float32 CODEC(Gorilla, ZSTD),
    close Float32 CODEC(Gorilla, ZSTD),
    volume Int64,
    time DateTime CODEC(LZ4HC),
    isComplete Bool CODEC(Gorilla, ZSTD),
    tf Int8 CODEC(Gorilla, ZSTD)
) ENGINE = ReplacingMergeTree() ORDER BY (ticker, figi, open, high, low, close, volume, time, isComplete, tf);


SELECT COUNT(*) FROM GetCandles

INSERT INTO GetCandles10 (*) select arrayElement(array('ENDP','CSCO','NVDA','AAPL','GOOGL'), 1 + rand() % 5), arrayElement(array('BBG000BBJQV1','BBG000BBJQV2','BBG000BBJQV3','BBG000BBJQV4','BBG000BBJQV5'), 1 + rand()
 % 5),rand()*rand() * 0.00000001,rand()*rand() * 0.00000001,rand()*rand() * 0.00000001,rand()*rand() * 0.00000001,rand()*rand(),now(),rand()*rand()+1,rand(), arrayElement(array('USD','RUB','HKD'), 1 + rand() % 3) from system.numbers limit 1000000;

(figi, open, high, low, close, time, tf);
вставка
0 rows in set. Elapsed: 2.353 sec. Processed 1.00 million rows, 8.00 MB (425.05 thousand rows/s., 3.40 MB/s.)







вставка
Elapsed: 2.529 sec. Processed 1.00 million rows, 8.00 MB (395.40 thousand rows/s., 3.16 MB/s.)
выборка селектом
Elapsed: 0.168 sec. Processed 995.74 thousand rows, 31.87 MB (5.94 million rows/s., 190.03 MB/s.)
размер таблицы
GetCandles10            │ 9.99 MiB
select count (*) from GetCandles10


CREATE TABLE IF NOT EXISTS GetCandles11
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
) ENGINE = ReplacingMergeTree() ORDER BY (figi, open, high, low, close, time, tf);

SELECT * FROM GetCandles8
Elapsed: 1.012 sec. Processed 24.45 million rows, 782.50 MB (24.16 million rows/s., 773.24 MB/s.)
SELECT * FROM GetCandles9
Elapsed: 1.001 sec. Processed 24.37 million rows, 779.92 MB (24.34 million rows/s., 779.18 MB/s.)


CREATE TABLE IF NOT EXISTS GetCandles10
(
    ticker LowCardinality(String),
    figi LowCardinality(String),
    open Float32 CODEC(Gorilla, ZSTD),
    high Float32 CODEC(Gorilla, ZSTD),
    low Float32 CODEC(Gorilla, ZSTD),
    close Float32 CODEC(Gorilla, ZSTD),
    volume Int64,
    time DateTime CODEC(LZ4HC),
    isComplete Bool CODEC(Gorilla, ZSTD),
    tf Int8 CODEC(Gorilla, ZSTD)
) ENGINE = MergeTree() ORDER BY tuple();


CREATE TABLE IF NOT EXISTS GetCandles10
(
    ticker LowCardinality(String),
    figi LowCardinality(String),
    open Float32 CODEC(Gorilla, ZSTD),
    high Float32 CODEC(Gorilla, ZSTD),
    low Float32 CODEC(Gorilla, ZSTD),
    close Float32 CODEC(Gorilla, ZSTD),
    volume Int64,
    time DateTime CODEC(LZ4HC),
    isComplete Bool CODEC(Gorilla, ZSTD),
    tf Int8 CODEC(Gorilla, ZSTD)
) ENGINE = ReplacingMergeTree() ORDER BY (figi, time, low, close);


Elapsed: 20.827 sec. Processed 50.33 million rows, 402.64 MB (2.42 million rows/s., 19.33 MB/s.)
0.1

select * from GetCandles10



CREATE TABLE IF NOT EXISTS GetCandles3
(
    ticker LowCardinality(String),
    figi LowCardinality(String),
    open Float32 CODEC(Gorilla, ZSTD),
    high Float32 CODEC(Gorilla, ZSTD),
    low Float32 CODEC(Gorilla, ZSTD),
    close Float32 CODEC(Gorilla, ZSTD),
    volume Int64 CODEC(T64 , ZSTD),
    time DateTime CODEC(LZ4HC),
    isComplete Bool,
    tf Int8 CODEC(T64, ZSTD)
) ENGINE = ReplacingMergeTree() ORDER BY (figi, time, low, close);

-- OPTIMIZE TABLE GetCandles3

CREATE TABLE IF NOT EXISTS GetCandles5
(
    ticker LowCardinality(String),
    figi LowCardinality(String),
    open Float32 CODEC(Gorilla, ZSTD),
    high Float32 CODEC(Gorilla, ZSTD),
    low Float32 CODEC(Gorilla, ZSTD),
    close Float32 CODEC(Gorilla, ZSTD),
    volume Int64,
    time DateTime CODEC(LZ4HC),
    isComplete Bool,
    tf Int8
) ENGINE = ReplacingMergeTree() ORDER BY (figi, time, low, close);


CREATE TABLE IF NOT EXISTS GetCandles8
(
    ticker LowCardinality(String),
    figi LowCardinality(String),
    open Float32 CODEC(Gorilla, ZSTD),
    high Float32 CODEC(Gorilla, ZSTD),
    low Float32 CODEC(Gorilla, ZSTD),
    close Float32 CODEC(Gorilla, ZSTD),
    volume Int64 CODEC(T64, ZSTD),
    time DateTime,
    isComplete Bool,
    tf Int8 CODEC(T64, ZSTD)
) ENGINE = ReplacingMergeTree() ORDER BY (figi, time, low, close);