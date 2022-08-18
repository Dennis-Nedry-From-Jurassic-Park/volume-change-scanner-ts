CREATE TABLE IF NOT EXISTS db.metrics
(
    n Int32,
    TICKER LowCardinality(String) DEFAULT arrayElement(array('PLTR','ENDP','MSFT'), 1 + rand() % 3) comment 'Тикер компании' CODEC(ZSTD),
    -- Quantitative metrics
    CREATED_AT DateTime DEFAULT now() comment 'время появления метрики в таблице' CODEC(ZSTD),
    YYYYQ UInt16 DEFAULT formatDateTime(CREATED_AT, '%Y%Q') comment 'формат времени вида : год и номер текущего квартала' Codec(T64),
    COUNTRY LowCardinality(String) DEFAULT arrayElement(array('RUSSIA','USA','CHINA','GERMANY','IRELAND'), 1 + rand() % 5) comment 'Страна регистрации головного офиса компании' CODEC(ZSTD),
    SECTOR LowCardinality(String) DEFAULT arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5) comment 'Сектор деятельности компании' CODEC(ZSTD),
    INDUSTRY LowCardinality(String) DEFAULT arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5) comment 'Отрасль деятельности компании' CODEC(ZSTD),
    PE Float32 DEFAULT n comment 'Price over Earnings' CODEC(Gorilla, ZSTD),
    PBratio Float32 DEFAULT n comment 'Price over Book Value' CODEC(Gorilla, ZSTD),
    PriceToSalesRatio Float32 DEFAULT n comment 'Price over Sales Ratio?' CODEC(Gorilla, ZSTD),
    PriceToSales Float32 DEFAULT n comment 'Price over Sales' CODEC(Gorilla, ZSTD),
    PriceToSalesRatioTTM Float32 DEFAULT n comment 'priceToSalesTrailing12Months' CODEC(Gorilla, ZSTD),
    PFCF Float32 DEFAULT n comment 'Price over FCF - Free Cash Flow' CODEC(Gorilla, ZSTD),
    PEG Float32 DEFAULT n comment 'Price over earningsGrowth' CODEC(Gorilla, ZSTD),
    PegRatio Float32 DEFAULT n comment 'pegRatio similar PEG' CODEC(Gorilla, ZSTD),
    PTBV Float32 DEFAULT n comment 'Price over TangibleBookValuePerShare' CODEC(Gorilla, ZSTD),
    PNCAV Float32 DEFAULT n comment 'Price over (totalAssets - totalLiab)' CODEC(Gorilla, ZSTD),
    EVEB Float32 DEFAULT n comment 'EnterpriseValue (EV) over EBITDA' CODEC(Gorilla, ZSTD),
    EVtoEBIT Float32 DEFAULT n comment 'EnterpriseValue (EV) over EBIT' CODEC(Gorilla, ZSTD),
    EVoverOCF Float32 DEFAULT n comment 'EnterpriseValue (EV) over OperatingCashFlow (OCF)' CODEC(Gorilla, ZSTD),
    EVtoSalesRatio Float32 DEFAULT n comment 'EnterpriseValue (EV) over Sales (Revenue)' CODEC(Gorilla, ZSTD),
    recommendationMean Float32 DEFAULT n comment 'Cредняя оценка акции от аналитиков First Call (1 - buy, 3 - hold, 5 - sell)' CODEC(Gorilla, ZSTD),
    bookValue Float32 DEFAULT n comment 'bookValue' CODEC(Gorilla, ZSTD),
    price Float32 DEFAULT n comment 'Price' CODEC(Gorilla, ZSTD),
    currency LowCardinality(String) DEFAULT arrayElement(array('RUSSIA','USA','CHINA','GERMANY','IRELAND'), 1 + rand() % 5) comment 'Страна регистрации головного офиса компании' CODEC(ZSTD),

    MarginOfSafety UInt16 DEFAULT rand() Codec(Delta, ZSTD),
    -- ------------------------------ Historical PE ------------------------------------
    PEPE5LOW Float32 DEFAULT n comment '(PEcurrent / PE5year)low' CODEC(Gorilla, ZSTD),
    PEPE5HIGH Float32 DEFAULT n comment '(PEcurrent / PE5year)high' CODEC(Gorilla, ZSTD),
    PEPE10LOW Float32 DEFAULT n comment '(PEcurrent / PE10year)low' CODEC(Gorilla, ZSTD),
    PEPE10HIGH Float32 DEFAULT n comment '(PEcurrent / PE10year)high' CODEC(Gorilla, ZSTD),
    -- ------------------------------ Health metrics -----------------------------------
    CurrentRatio DECIMAL32(2) DEFAULT n Codec(T64, ZSTD),
    QuickRatio DECIMAL32(2) DEFAULT n Codec(T64, ZSTD),
    FlowRatio DECIMAL32(2) DEFAULT n comment 'how effectively cash flow is managed (take from balance sheet)' Codec(T64, ZSTD),

    LiabilitiesToEquity Float32 DEFAULT n CODEC(Gorilla, ZSTD),

    DebtToEquity Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    DebtToEbitda Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    DebtToNCAV Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    LongTermDebtOverWorkingCapital Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    FCFS Float32 DEFAULT n comment 'Free Cash Flow over Sales' CODEC(Gorilla, ZSTD),
    -- Efficiency metrics - https://blog.financemarker.ru/roic/
    ROE Float32 DEFAULT n comment 'ROE - Return on Equity (Рентабельность собственного капитала)' CODEC(Gorilla, ZSTD),
    ROA Float32 DEFAULT n comment 'ROA - Return on Assets (Рентабельность активов)' CODEC(Gorilla, ZSTD),
    ROTA Float32 DEFAULT n comment 'ROTA - Return on Assets (Рентабельность капитала)' CODEC(Gorilla, ZSTD),
    ROIC Float32 DEFAULT n comment 'ROTA - Return on Invested CapitaL' CODEC(Gorilla, ZSTD),
    ROCE Float32 DEFAULT n comment 'ROTA - Return on Assets (Рентабельность капитала)' CODEC(Gorilla, ZSTD),
    -- Growth metrics
    EarningsYield UInt16 DEFAULT rand() Codec(Delta, ZSTD),
    EbitYield UInt16 DEFAULT rand() Codec(Delta, ZSTD),
    EbitdaYield UInt16 DEFAULT rand() Codec(Delta, ZSTD),
    FCFyield UInt16 DEFAULT rand() comment 'Free Cash Flow Yield' Codec(Delta, ZSTD),
    FPEoverTPE Float32 DEFAULT n comment 'Forward PE over Trailing PE' CODEC(Gorilla, ZSTD),
    OCFoverEPS Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    -- Scores (Altman, Piotroski, Beneish)
    AltmanScore Float32 DEFAULT n  comment 'Altman Z-score' CODEC(Gorilla, ZSTD),
    PiotroskiScore Float32 DEFAULT n comment 'Piotroski Z-score' CODEC(Gorilla, ZSTD),
    BeneishScore Float32 DEFAULT n comment 'Beneish Z-score' CODEC(Gorilla, ZSTD),
    -- Risks (Overall)
    ShareHolderRightsRisk UInt8 DEFAULT arrayElement(array(1,4,6,8,10), 1 + rand() % 5) comment 'риск владения акциями' Codec(Delta, ZSTD),
    OverallRisk UInt8 DEFAULT arrayElement(array(1,4,6,8,10), 1 + rand() % 5) comment 'общий риск' Codec(Delta, ZSTD),
    RecommendationKey Enum8('sell' = -1, 'hold' = 0, 'buy' = 1) DEFAULT arrayElement(array('sell', 'buy','hold'), 1 + rand() % 3) comment 'Прогноз по акции : sell, buy, hold' CODEC(ZSTD)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(CREATED_AT)
ORDER BY tuple()

insert into db.metrics (n)
select rand() * 0.1 % 100 from numbers(5)
settings max_block_size=1000000;



insert into db.metrics_zsdt (n)
select rand() * 0.1 % 1000 from numbers(100000000)
settings max_block_size=1000000;

SELECT -- common size
    concat(database, '.', table) AS table,
    formatReadableSize(sum(bytes)) AS size,
    sum(bytes) AS bytes_size,
    sum(rows) AS rows,
    max(modification_time) AS latest_modification,
    any(engine) AS engine
FROM system.parts
--WHERE active
GROUP BY
    database,
    table
ORDER BY bytes_size DESC

SELECT
    name,
    formatReadableSize(data_uncompressed_bytes) AS uncompressed,
    formatReadableSize(data_compressed_bytes) AS compressed,
    data_uncompressed_bytes / data_compressed_bytes AS compress_ratio
FROM system.columns
WHERE table = 'metrics_zsdt'

SELECT
    name,
    formatReadableSize(data_uncompressed_bytes) AS uncompressed,
    formatReadableSize(data_compressed_bytes) AS compressed,
    data_uncompressed_bytes / data_compressed_bytes AS compress_ratio
FROM system.columns
WHERE table = 'historical'
order by compress_ratio desc

┌─name─────┬─uncompressed─┬─compressed─┬─────compress_ratio─┐
│ n        │ 381.47 MiB   │ 274.12 MiB │ 1.3916076892600981 │
│ ticker   │ 95.71 MiB    │ 52.33 MiB  │ 1.8289557138099504 │
│ date     │ 381.47 MiB   │ 280.21 KiB │ 1394.0488056486859 │
│ open     │ 381.47 MiB   │ 312.39 MiB │ 1.2211285448987688 │
│ high     │ 381.47 MiB   │ 312.39 MiB │ 1.2211285448987688 │
│ low      │ 381.47 MiB   │ 312.39 MiB │ 1.2211285448987688 │
│ close    │ 381.47 MiB   │ 312.39 MiB │ 1.2211285448987688 │
│ adjClose │ 381.47 MiB   │ 312.39 MiB │ 1.2211285448987688 │
│ volume   │ 762.94 MiB   │ 503.95 MiB │ 1.5139318853166546 │
└──────────┴──────────────┴────────────┴────────────────────┘


┌─name─────┬─uncompressed─┬─compressed─┬─────compress_ratio─┐
│ n        │ 381.47 MiB   │ 274.12 MiB │  1.391629926302967 │
│ ticker   │ 95.71 MiB    │ 52.33 MiB  │ 1.8289815463431074 │
│ date     │ 381.47 MiB   │ 280.21 KiB │ 1394.0488056486859 │
│ open     │ 381.47 MiB   │ 310.03 MiB │ 1.2304169491460462 │
│ high     │ 381.47 MiB   │ 310.03 MiB │ 1.2304169491460462 │
│ low      │ 381.47 MiB   │ 310.03 MiB │ 1.2304169491460462 │
│ close    │ 381.47 MiB   │ 310.03 MiB │ 1.2304169491460462 │
│ adjClose │ 381.47 MiB   │ 310.03 MiB │ 1.2304169491460462 │
│ volume   │ 762.94 MiB   │ 543.15 MiB │ 1.4046624409071022 │
└──────────┴──────────────┴────────────┴────────────────────┘

insert into db.historical5 (n)
select rand() * 0.1 % 1000 from numbers(100000000) settings max_block_size=100000;


CREATE TABLE IF NOT EXISTS db.historical
(
    n Int32,
     `date` DateTime DEFAULT now() CODEC(ZSTD),
    A0 DECIMAL32(6) DEFAULT n Codec(Gorilla, ZSTD(11)),
    A DECIMAL32(6) DEFAULT n Codec(Gorilla, ZSTD),
    B DECIMAL32(6) DEFAULT n Codec(T64, ZSTD),
    C DECIMAL32(6) DEFAULT n Codec(Delta, ZSTD),
    D DECIMAL32(6) DEFAULT n Codec(DoubleDelta, ZSTD),

    A2 DECIMAL32(6) DEFAULT n Codec(Gorilla, LZ4),
    B2 DECIMAL32(6) DEFAULT n Codec(T64, LZ4),
    C2 DECIMAL32(6) DEFAULT n Codec(Delta, LZ4),
    D2 DECIMAL32(6) DEFAULT n Codec(DoubleDelta, LZ4)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY tuple()


CREATE TABLE IF NOT EXISTS db.historical5
(
    n Int32,
     `date` DateTime DEFAULT now() CODEC(ZSTD),
    A0 DECIMAL32(6) DEFAULT n Codec(Gorilla, ZSTD(11)),
    A DECIMAL32(6) DEFAULT n Codec(Gorilla, ZSTD),
    B DECIMAL32(6) DEFAULT n Codec(T64, ZSTD),
    C DECIMAL32(6) DEFAULT n Codec(Delta, ZSTD),
    D DECIMAL32(6) DEFAULT n Codec(DoubleDelta, ZSTD),

    A2 DECIMAL32(6) DEFAULT n Codec(Gorilla, LZ4),
    B2 DECIMAL32(6) DEFAULT n Codec(T64, LZ4),
    C2 DECIMAL32(6) DEFAULT n Codec(Delta, LZ4),
    D2 DECIMAL32(6) DEFAULT n Codec(DoubleDelta, LZ4)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY tuple()

Codec(T64, LZ4)

historical_1d
historical_1wk
historical_1mo

insert into db.historical_1mo (n)
select rand() * 0.1 % 1000 from numbers(1000) settings max_block_size=100000;

CREATE TABLE IF NOT EXISTS db.historical_1mo
(
    n Int32,
    ticker LowCardinality(String) DEFAULT n CODEC(ZSTD),
    `date` DateTime DEFAULT n CODEC(ZSTD),
    `open` DECIMAL32(6) DEFAULT n Codec(Gorilla, ZSTD),
    high DECIMAL32(6) DEFAULT n Codec(Gorilla, ZSTD),
    low DECIMAL32(6) DEFAULT n Codec(Gorilla, ZSTD),
    `close` DECIMAL32(6) DEFAULT n Codec(Gorilla, ZSTD),
    adjClose DECIMAL32(6) DEFAULT n CODEC(Gorilla, ZSTD),
    volume UInt64 DEFAULT n CODEC(T64, ZSTD)
)
ENGINE = MergeTree()
PARTITION BY (toYear(date))
ORDER BY tuple()
--SETTINGS max_partitions_per_insert_block=1000

insert into db.historical (n)
select rand() * 0.1 % 1000 from numbers(100000000) settings max_block_size=100000;


CREATE TABLE IF NOT EXISTS db.metrics_zsdt
(
    n Int32,
    TICKER LowCardinality(String) DEFAULT arrayElement(array('PLTR','ENDP','MSFT'), 1 + rand() % 3) comment 'Тикер компании' CODEC(ZSTD),
    -- Quantitative metrics
    CREATED_AT DateTime DEFAULT now() comment 'время появления метрики в таблице' CODEC(ZSTD),
    YYYYQ UInt16 DEFAULT formatDateTime(CREATED_AT, '%Y%Q') comment 'формат времени вида : год и номер текущего квартала' Codec(T64),
    COUNTRY LowCardinality(String) DEFAULT arrayElement(array('RUSSIA','USA','CHINA','GERMANY','IRELAND'), 1 + rand() % 5) comment 'Страна регистрации головного офиса компании' CODEC(ZSTD),
    CountryWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    SECTOR LowCardinality(String) DEFAULT arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5) comment 'Сектор деятельности компании' CODEC(ZSTD),
    SectorWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    INDUSTRY LowCardinality(String) DEFAULT arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5) comment 'Отрасль деятельности компании' CODEC(ZSTD),
    PE Float32 DEFAULT n comment 'Price over Earnings' CODEC(Gorilla, ZSTD),
    peWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    PBratio Float32 DEFAULT n comment 'Price over Book Value' CODEC(Gorilla, ZSTD),
    pbWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    PriceToSalesRatio Float32 DEFAULT n comment 'Price over Sales Ratio?' CODEC(Gorilla, ZSTD),
    PriceToSalesRatioWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    PriceToSales Float32 DEFAULT n comment 'Price over Sales' CODEC(Gorilla, ZSTD),
    PriceToSalesWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    PriceToSalesRatioTTM Float32 DEFAULT n comment 'priceToSalesTrailing12Months' CODEC(Gorilla, ZSTD),
    PriceToSalesRatioTTMWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    PFCF Float32 DEFAULT n comment 'Price over FCF - Free Cash Flow' CODEC(Gorilla, ZSTD),
    PriceOverFCFweight Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    PEG Float32 DEFAULT n comment 'Price over earningsGrowth' CODEC(Gorilla, ZSTD),
    PegRatio Float32 DEFAULT n comment 'pegRatio similar PEG' CODEC(Gorilla, ZSTD),
    PegWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    PTBV Float32 DEFAULT n comment 'Price over TangibleBookValuePerShare' CODEC(Gorilla, ZSTD),
    PTBVweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    PNCAV Float32 DEFAULT n comment 'Price over (totalAssets - totalLiab)' CODEC(Gorilla, ZSTD),
    PNCAVweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    EVEB Float32 DEFAULT n comment 'EnterpriseValue (EV) over EBITDA' CODEC(Gorilla, ZSTD),
    EVEBweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    EVtoEBIT Float32 DEFAULT n comment 'EnterpriseValue (EV) over EBIT' CODEC(Gorilla, ZSTD),
    EVtoEBITweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    EVoverOCF Float32 DEFAULT n comment 'EnterpriseValue (EV) over OperatingCashFlow (OCF)' CODEC(Gorilla, ZSTD),
    EVoverOCFweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    EVtoSalesRatio Float32 DEFAULT n comment 'EnterpriseValue (EV) over Sales (Revenue)' CODEC(Gorilla, ZSTD),
    EVtoSalesRatioWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    recommendationMean Float32 DEFAULT n comment 'Cредняя оценка акции от аналитиков First Call (1 - buy, 3 - hold, 5 - sell)' CODEC(Gorilla, ZSTD),
    bookValue Float32 DEFAULT n comment 'bookValue' CODEC(Gorilla, ZSTD),
    price Float32 DEFAULT n comment 'Price' CODEC(Gorilla, ZSTD),
    currency LowCardinality(String) DEFAULT arrayElement(array('RUSSIA','USA','CHINA','GERMANY','IRELAND'), 1 + rand() % 5) comment 'Страна регистрации головного офиса компании' CODEC(ZSTD),

    MarginOfSafety UInt16 DEFAULT rand() Codec(Delta, ZSTD),
    -- ------------------------------ Historical PE ------------------------------------
    PEPE5LOW Float32 DEFAULT n comment '(PEcurrent / PE5year)low' CODEC(Gorilla, ZSTD),
    PEPE5HIGH Float32 DEFAULT n comment '(PEcurrent / PE5year)high' CODEC(Gorilla, ZSTD),
    PEPE10LOW Float32 DEFAULT n comment '(PEcurrent / PE10year)low' CODEC(Gorilla, ZSTD),
    PEPE10HIGH Float32 DEFAULT n comment '(PEcurrent / PE10year)high' CODEC(Gorilla, ZSTD),
    -- ------------------------------ Health metrics -----------------------------------
    CurrentRatio DECIMAL32(2) DEFAULT n Codec(T64, ZSTD),
    CurrentRatioWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    QuickRatio DECIMAL32(2) DEFAULT n Codec(T64, ZSTD),
    QuickRatioWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    FlowRatio DECIMAL32(2) DEFAULT n comment 'how effectively cash flow is managed (take from balance sheet)' Codec(T64, ZSTD),
    FlowRatioWeight INT8 DEFAULT n CODEC(Delta, ZSTD),

    LiabilitiesToEquity Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    LiabilitiesToEquityWeight INT8 DEFAULT n CODEC(Delta, ZSTD),

    DebtToEquity Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    DebtToEquityWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    DebtToEbitda Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    DebtToEbitdaWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    DebtToNCAV Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    DebtToNCAVweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    LongTermDebtOverWorkingCapital Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    LongTermDebtOverWorkingCapitalWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    FCFS Float32 DEFAULT n comment 'Free Cash Flow over Sales' CODEC(Gorilla, ZSTD),
    FCFSweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    -- Efficiency metrics - https://blog.financemarker.ru/roic/
    ROE Float32 DEFAULT n comment 'ROE - Return on Equity (Рентабельность собственного капитала)' CODEC(Gorilla, ZSTD),
    ROEweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    ROA Float32 DEFAULT n comment 'ROA - Return on Assets (Рентабельность активов)' CODEC(Gorilla, ZSTD),
    ROAweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    ROTA Float32 DEFAULT n comment 'ROTA - Return on Assets (Рентабельность капитала)' CODEC(Gorilla, ZSTD),
    ROTAweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    ROIC Float32 DEFAULT n comment 'ROTA - Return on Invested CapitaL' CODEC(Gorilla, ZSTD),
    ROICweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    ROCE Float32 DEFAULT n comment 'ROTA - Return on Assets (Рентабельность капитала)' CODEC(Gorilla, ZSTD),
    ROCEweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    -- Growth metrics
    EarningsYield UInt16 DEFAULT rand() Codec(Delta, ZSTD),
    EarningsYieldWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    EbitYield UInt16 DEFAULT rand() Codec(Delta, ZSTD),
    EbitYieldWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    EbitdaYield UInt16 DEFAULT rand() Codec(Delta, ZSTD),
    EbitdaYieldWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    FCFyield UInt16 DEFAULT rand() comment 'Free Cash Flow Yield' Codec(Delta, ZSTD),
    FCFyieldWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    FPEoverTPE Float32 DEFAULT n comment 'Forward PE over Trailing PE' CODEC(Gorilla, ZSTD),
    FPEoverTPEweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    OCFoverEPS Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    OCFoverEPSweight INT8 DEFAULT n CODEC(Delta, ZSTD),
    -- Scores (Altman, Piotroski, Beneish)
    AltmanScore Float32 DEFAULT n  comment 'Altman Z-score' CODEC(Gorilla, ZSTD),
    AltmanScoreWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    PiotroskiScore Float32 DEFAULT n comment 'Piotroski Z-score' CODEC(Gorilla, ZSTD),
    PiotroskiScoreWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    BeneishScore Float32 DEFAULT n comment 'Beneish Z-score' CODEC(Gorilla, ZSTD),
    BeneishScoreWeight INT8 DEFAULT n CODEC(Delta, ZSTD),
    -- Risks (Overall)
    ShareHolderRightsRisk UInt8 DEFAULT arrayElement(array(1,4,6,8,10), 1 + rand() % 5) comment 'риск владения акциями' Codec(Delta, ZSTD),
    OverallRisk UInt8 DEFAULT arrayElement(array(1,4,6,8,10), 1 + rand() % 5) comment 'общий риск' Codec(Delta, ZSTD),
    RecommendationKey Enum8('sell' = -1, 'hold' = 0, 'buy' = 1) DEFAULT arrayElement(array('sell', 'buy','hold'), 1 + rand() % 3) comment 'Прогноз по акции : sell, buy, hold' CODEC(ZSTD)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(CREATED_AT)
ORDER BY tuple()




insert into db.metrics_zsdt (n)
select rand() * 0.1 % 1000 from numbers(100000000)
settings max_block_size=1000000;

-- Elapsed: 358.675 sec. Processed 100.00 million rows, 800.00 MB (278.80 thousand rows/s., 2.23 MB/s.)
-- Elapsed: 419.859 sec. Processed 100.00 million rows, 800.00 MB (238.17 thousand rows/s., 1.91 MB/s.)

insert into db.metrics_zsdt1 (n)
select rand() * 0.1 % 1000 from numbers(100000000)
settings max_block_size=1000000;

CREATE TABLE IF NOT EXISTS db.metrics_zsdt1
(
    n Int32,
    -- Quantitative metrics
    CREATED_AT DateTime DEFAULT now() comment 'время появления метрики в таблице',
    YYYYQ UInt16 DEFAULT formatDateTime(CREATED_AT, '%Y%Q') comment 'формат времени вида : год и номер текущего квартала',
    COUNTRY LowCardinality(String) DEFAULT arrayElement(array('RUSSIA','USA','CHINA','GERMANY','IRELAND'), 1 + rand() % 5) comment 'Страна регистрации головного офиса компании',
    INDUSTRY LowCardinality(String) DEFAULT arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5) comment 'Отрасль деятельности компании',
    SECTOR LowCardinality(String) DEFAULT arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5) comment 'Сектор деятельности компании',
    PE Float32 DEFAULT n comment 'Price over Earnings',
    price Float32 DEFAULT n comment 'Price',
    currency LowCardinality(String) DEFAULT arrayElement(array('GBP','USD','RUB'), 1 + rand() % 3) n comment 'Буквенный идентификатор валюты',
    PBratio Float32 DEFAULT n comment 'Price over Book Value',
    PriceToSalesRatio Float32 DEFAULT n comment 'Price over Sales',
    PFCF Float32 DEFAULT n comment 'Price over FCF - Free Cash Flow',
    PEG Float32 DEFAULT n comment 'Price over earningsGrowth',
    PTBV Float32 DEFAULT n comment 'Price over TangibleBookValuePerShare = \n(totalStockholderEquity - goodWill - intangibleassets) / shareNumber',
    PNCAV Float32 DEFAULT n comment 'Price over (totalAssets - totalLiab)',
    EVEB Float32 DEFAULT n comment 'EnterpriseValue (EV) over EBITDA',
    EVOCF Float32 DEFAULT n comment 'EnterpriseValue (EV) over OperatingCashFlow (OCF)',
    EVtoSalesRatio Float32 DEFAULT n comment 'EnterpriseValue (EV) over Sales',
    PEPE5LOW Float32 DEFAULT n comment '(PEcurrent / PE5year)low',
    PEPE5HIGH Float32 DEFAULT n comment '(PEcurrent / PE5year)high',
    PEPE15LOW Float32 DEFAULT n comment '(PEcurrent / PE15year)low',
    PEPE15HIGH Float32 DEFAULT n comment '(PEcurrent / PE15year)high',
    PEPE30LOW Float32 DEFAULT n comment '(PEcurrent / PE30year)low',
    PEPE30HIGH Float32 DEFAULT n comment '(PEcurrent / PE30year)high',
    MarginOfSafety UInt16 DEFAULT rand(),
    -- Health metrics
    CurrentRatio DECIMAL32(2) DEFAULT n,
    QuickRatio DECIMAL32(2) DEFAULT n,
    FlowRatio DECIMAL32(2) DEFAULT n,
    LiabilitiesToEquity Float32 DEFAULT n,
    DebtToEquity Float32 DEFAULT n,
    DebtToEbitda Float32 DEFAULT n,
    DebtToNCAV Float32 DEFAULT n,
    FCFS Float32 DEFAULT n comment 'Free Cash Flow over Sales',
    -- Growth metrics
    EarningsYield UInt16 DEFAULT rand(),
    EbitdaYield UInt16 DEFAULT rand(),
    FCFyield UInt16 DEFAULT rand() comment 'Free Cash Flow Yield',
    FPEoverTPE Float32 DEFAULT n comment 'Forward PE over Trailing PE',
    OCFoverEPS Float32 DEFAULT n,
    PEPE10LOW Float32 DEFAULT n comment '(PEcurrent / PE10year)low',
    PEPE10HIGH Float32 DEFAULT n comment '(PEcurrent / PE10year)high',
    -- Scores (Altman, Piotroski, Beneish)
    AltmanScore Float32 DEFAULT n  comment 'Altman Z-score',
    PiotroskiScore Float32 DEFAULT n comment 'Piotroski Z-score',
    BeneishScore Float32 DEFAULT n comment 'Beneish Z-score',
    -- Risks (Overall)
    ShareHolderRightsRisk UInt8 DEFAULT arrayElement(array(1,4,6,8,10), 1 + rand() % 5) comment 'риск владения акциями',
    OverallRisk UInt8 DEFAULT arrayElement(array(1,4,6,8,10), 1 + rand() % 5) comment 'общий риск',
    RecommendationKey Enum8('sell' = -1, 'hold' = 0, 'buy' = 1) DEFAULT arrayElement(array('sell', 'buy','hold'), 1 + rand() % 3) comment 'Прогноз по акции : sell, buy, hold'
)
ENGINE = MergeTree()
PARTITION BY YYYYQ
ORDER BY YYYYQ




SELECT
    formatReadableSize(sum(data_uncompressed_bytes)) AS uncompressed,
    formatReadableSize(sum(data_compressed_bytes)) AS compressed,
    sum(rows) AS total_rows
FROM system.parts
WHERE table = 'metrics_yyy0' OR table = 'metrics_yyy0'
UNION ALL
SELECT
    formatReadableSize(sum(data_uncompressed_bytes)) AS uncompressed,
    formatReadableSize(sum(data_compressed_bytes)) AS compressed,
    sum(rows) AS total_rows
FROM system.parts
WHERE table = 'metrics_yyy0'

SELECT
    name,
    formatReadableSize(data_uncompressed_bytes) AS uncompressed,
    formatReadableSize(data_compressed_bytes) AS compressed,
    data_uncompressed_bytes / data_compressed_bytes AS compress_ratio
FROM system.columns
WHERE table = 'metrics_yyy0'

SELECT
    name,
    formatReadableSize(data_uncompressed_bytes) AS uncompressed,
    formatReadableSize(data_compressed_bytes) AS compressed,
    data_uncompressed_bytes / data_compressed_bytes AS compress_ratio
FROM system.columns
WHERE table = 'metrics_yyy0'


CREATE DATABASE IF NOT EXISTS db
CREATE USER zowie DEFAULT ROLE ALL IDENTIFIED WITH plaintext_password BY '!qazxsw2'
CREATE USER zowie IDENTIFIED WITH plaintext_password BY '!qazxsw2'

CREATE TABLE IF NOT EXISTS db.metrics_xxx0
(
    -- Quantitative metrics
    CREATED_AT DateTime DEFAULT now() comment 'время появления метрики в таблице' CODEC(ZSTD),
    YYYYQ UInt16 DEFAULT formatDateTime(CREATED_AT, '%Y%Q') comment 'формат времени вида : год и номер текущего квартала' Codec(T64),
    COUNTRY LowCardinality(String) comment 'Страна регистрации головного офиса компании' CODEC(ZSTD),
    INDUSTRY LowCardinality(String) comment 'Отрасль деятельности компании' CODEC(ZSTD),
    SECTOR LowCardinality(String) comment 'Сектор деятельности компании' CODEC(ZSTD),
    PE Float32 comment 'Price over Earnings' CODEC(Gorilla, LZ4),
    price Float32 comment 'Price' CODEC(Gorilla, LZ4),
    PBratio Float32 comment 'Price over Book Value' CODEC(Gorilla, LZ4),
    PriceToSalesRatio Float32 comment 'Price over Sales' CODEC(Gorilla, LZ4),
    PFCF Float32 comment 'Price over FCF - Free Cash Flow' CODEC(Gorilla, LZ4),
    PEG Float32 comment 'Price over earningsGrowth' CODEC(Gorilla, LZ4),
    PTBV Float32 comment 'Price over TangibleBookValuePerShare = \n(totalStockholderEquity - goodWill - intangibleassets) / shareNumber' CODEC(Gorilla, LZ4),
    PNCAV Float32 comment 'Price over (totalAssets - totalLiab)' CODEC(Gorilla, LZ4),
    EVEB Float32 comment 'EnterpriseValue (EV) over EBITDA' CODEC(Gorilla, LZ4),
    EVOCF Float32 comment 'EnterpriseValue (EV) over OperatingCashFlow (OCF)' CODEC(Gorilla, LZ4),
    EVtoSalesRatio Float32 comment 'EnterpriseValue (EV) over Sales' CODEC(Gorilla, LZ4),
    PEPE5LOW Float32 comment '(PEcurrent / PE5year)low' CODEC(Gorilla, LZ4),
    PEPE5HIGH Float32 comment '(PEcurrent / PE5year)high' CODEC(Gorilla, LZ4),
    PEPE15LOW Float32 comment '(PEcurrent / PE15year)low' CODEC(Gorilla, LZ4),
    PEPE15HIGH Float32 comment '(PEcurrent / PE15year)high' CODEC(Gorilla, LZ4),
    PEPE30LOW Float32 comment '(PEcurrent / PE30year)low' CODEC(Gorilla, LZ4),
    PEPE30HIGH Float32 comment '(PEcurrent / PE30year)high' CODEC(Gorilla, LZ4),
    MarginOfSafety UInt16 Codec(T64),
    -- Health metrics
    CurrentRatio DECIMAL32(2),
    QuickRatio DECIMAL32(2),
    FlowRatio DECIMAL32(2),
    LiabilitiesToEquity Float32 CODEC(Gorilla, LZ4),
    DebtToEquity Float32 CODEC(Gorilla, LZ4),
    DebtToEbitda Float32 CODEC(Gorilla, LZ4),
    DebtToNCAV Float32 CODEC(Gorilla, LZ4),
    FCFS Float32 comment 'Free Cash Flow over Sales' CODEC(Gorilla, LZ4),
    -- Growth metrics
    EarningsYield UInt16 Codec(T64),
    EbitdaYield UInt16 Codec(T64),
    FCFyield UInt16 comment 'Free Cash Flow Yield' Codec(T64),
    FPEoverTPE Float32 comment 'Forward PE over Trailing PE' CODEC(Gorilla, LZ4),
    OCFoverEPS Float32 CODEC(Gorilla, LZ4),
    PEPE10LOW Float32 comment '(PEcurrent / PE10year)low' CODEC(Gorilla, LZ4),
    PEPE10HIGH Float32 comment '(PEcurrent / PE10year)high' CODEC(Gorilla, LZ4),
    -- Scores (Altman, Piotroski, Beneish)
    AltmanScore Float32 comment 'Altman Z-score' CODEC(Gorilla, LZ4),
    PiotroskiScore Float32 comment 'Piotroski Z-score' CODEC(Gorilla, LZ4),
    BeneishScore Float32 comment 'Beneish Z-score' CODEC(Gorilla, LZ4),
    -- Risks (Overall)
    ShareHolderRightsRisk UInt8 comment 'риск владения акциями' Codec(T64),
    OverallRisk UInt8 comment 'общий риск' Codec(T64),
    RecommendationKey Enum8('sell' = -1, 'hold' = 0, 'buy' = 1) comment 'Прогноз по акции : sell, buy, hold' CODEC(ZSTD)
)
ENGINE = MergeTree()--GenerateRandom(1, 5, 2)
PARTITION BY YYYYQ
ORDER BY YYYYQ

SELECT * FROM db.metrics_x9 LIMIT 5

SET max_memory_usage = 6000000000;
SET timeout_overflow_mode = break;

SELECT array('IT','HEALTH','OIL','RETAIL','ATOMIC') AS res
SELECT arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5)
SELECT range (1, 6, 1)

SELECT arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5)

insert into db.metrics_xxx0
(
    ID,
    INDUSTRY,
    SECTOR,
    PE,
    PBratio,
    PriceToSalesRatio,
    PFCF,
    PEG,
    PTBV,
    PNCAV,
    EVEB,
    EVOCF,
    EVtoSalesRatio,
    PEPE5LOW,
    PEPE5HIGH,
    PEPE15LOW,
    PEPE15HIGH,
    PEPE30LOW,
    PEPE30HIGH,
    MarginOfSafety,
    CurrentRatio,
    QuickRatio,
    FlowRatio,
    LiabilitiesToEquity,
    DebtToEquity,
    DebtToEbitda,
    DebtToNCAV,
    FCFS,
    EarningsYield,
    EbitdaYield,
    FCFyield,
    FPEoverTPE,
    OCFoverEPS,
    PEPE10LOW,
    PEPE10HIGH,
    AltmanScore,
    PiotroskiScore,
    BeneishScore
)
select
    rand(),
    arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5),
    arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5),
    9.23455,
    8.23455,
    7.23455,
    6.23455,
    5.23455,
    4.23455,
    3.23455,
    2.23455,
    9.23455,
    8.23455,
    7.23455,
    6.23455,
    5.23455,
    4.23455,
    3.23455,
    2.23455,
    rand(),
    9.23455,
    8.23455,
    7.23455,
    6.23455,
    5.23455,
    4.23455,
    3.23455,
    2.23455,
    rand(),
    rand(),
    rand(),
    8.23455,
    7.23455,
    6.23455,
    5.23455,
    4.23455,
    3.23455,
    2.23455
from system.numbers limit 5;



describe db.metrics_x6

CREATE TABLE IF NOT EXISTS db.metrics_x5
(
    CREATED_AT DateTime DEFAULT now() comment 'время появления метрики в таблице' Codec(DoubleDelta, LZ4),
    YYYYQ UInt16 DEFAULT formatDateTime(CREATED_AT, '%Y%Q') comment 'формат времени вида : год и номер текущего квартала' Codec(T64),
    ID UInt32, -- Q FixedString(6),
    SECTOR String comment 'Сектор деятельности компании',
    PE Float32 comment 'Price over Earnings' CODEC(Gorilla, LZ4)
    --PB Float32 comment 'Price over Book Value' CODEC(Gorilla, LZ4)
    --PS Float32 comment 'Price over Sales' CODEC(Gorilla, LZ4)
    --PFCF Float32 comment 'Price over FCF - Free Cash Flow' CODEC(Gorilla, LZ4)
    --PEG Float32 comment 'Price over FCF - Free Cash Flow' CODEC(Gorilla, LZ4)
)
ENGINE = MergeTree()
PARTITION BY YYYYQ
ORDER BY ID
-- rjkbxество строк в в таблице
SELECT count() FROM db.metrics_x9
-- 2020 Q4 HEALTH
insert into db.metrics_x6(CREATED_AT, ID, SECTOR, PE)
select toDateTime64('2020-12-01 10:20:30.999', 3), rand(), 'HEALTH', rand()  * 0.000000001
from system.numbers limit 10000;
-- 2021 Q1 AUTOMOTIVE
insert into db.metrics_x6(CREATED_AT, ID, SECTOR, PE)
select toDateTime64('2021-02-15 10:20:30.999', 3), rand(), 'AUTOMOTIVE', rand()  * 0.000000001
from system.numbers limit 10000;
-- 2021 Q2 OIL
insert into db.metrics_x6(CREATED_AT, ID, SECTOR, PE)
select toDateTime64('2021-04-15 10:20:30.999', 3), rand(), 'OIL', rand()  * 0.000000001
from system.numbers limit 10000;
-- 2021 Q3 RETAIL
insert into db.metrics_x6(CREATED_AT, ID, SECTOR, PE)
select toDateTime64('2021-08-24 10:20:30.999', 3), rand(), 'RETAIL', rand()  * 0.000000001
from system.numbers limit 10000;
-- 2021 Q4 RETAIL
insert into db.metrics_x6(CREATED_AT, ID, SECTOR, PE)
select toDateTime64('2021-11-24 10:20:30.999', 3), rand(), 'IT', rand()  * 0.000000001
from system.numbers limit 10000;
-- 2021 Q4 RETAIL
insert into db.metrics_x6(CREATED_AT, ID, SECTOR, PE)
select toDateTime64('2021-12-24 10:20:30.999', 3), rand(), 'OIL', rand()  * 0.000000001
from system.numbers limit 10000;


insert into db.metrics_x5(CREATED_AT, ID, SECTOR, PE)
select toDateTime64('2021-12-24 10:20:30.999', 3), rand(), 'OIL', rand()  * 0.000000001
from system.numbers limit 10000;

GROUP BY YYYYQ, SECTOR

SELECT table,
    formatReadableSize(sum(bytes)) as size,
    min(min_date) as min_date,
    max(max_date) as max_date
    FROM system.parts
    --WHERE active
GROUP BY table

SELECT * FROM db.metrics_x6
GROUP BY CREATED_AT, YYYYQ, ID, SECTOR, PE
ORDER BY SECTOR ASC
LIMIT 5 BY YYYYQ, SECTOR
LIMIT 100


SELECT table,
    formatReadableSize(sum(bytes)) as size,
    min(min_date) as min_date,
    max(max_date) as max_date
    FROM system.parts
    --WHERE active
GROUP BY table

SELECT *, arrayJoin(arraySlice(arrayReverseSort(groupArray(YYYYQ)), 1, 2)) YYYYQ2 FROM db.metrics_x6
GROUP BY CREATED_AT, YYYYQ, ID, SECTOR, PE
ORDER BY SECTOR ASC
LIMIT 20 BY YYYYQ, SECTOR
LIMIT 100

SELECT
    id2,
    id4,
    arrayJoin(arraySlice(arrayReverseSort(groupArray(v3)), 1, 2)) v3
FROM tbl
GROUP BY
    id2,
    id4


SELECT formatDateTime(toDateTime64('2021-08-06 10:20:30.999', 3), '%Y%Q')

INSERT INTO db.metrics_x4 (ID, SECTOR, PE) VALUES
(1, 'OIL', NULL)(2, 'HEALTH', 2.23456789)(3, NULL, 2.56)

WITH toDateTime64('2021-08-06 10:20:30.999', 3) AS dt64 SELECT toQuarter(dt64);

WITH
    (
        SELECT toRelativeQuarterNum(toDate('1970-01-01'))
    ) AS init
SELECT
    -- build the date from the relative quarter number
    toDate('2021-08-06 10:20:30.999') + toIntervalQuarter(q - init) AS time

WITH toDateTime64('2021-08-06 10:20:30.999', 3) AS dt64 SELECT toQuarter(dt64);
WITH toDateTime64('2021-08-06 10:20:30.999', 3) AS dt64 SELECT toQuarter(dt64);
WITH toDateTime64('2021-08-06 10:20:30.999', 3) AS dt64 SELECT toQuarter(dt64);
SELECT formatDateTime(toDate('2010-01-04'), '%Q')
-- Tables size in ClickHouse
-- https://gist.github.com/sanchezzzhak/511fd140e8809857f8f1d84ddb937015
SELECT
    concat(database, '.', table) AS table,
    formatReadableSize(sum(bytes)) AS size,
    sum(bytes) AS bytes_size,
    sum(rows) AS rows,
    max(modification_time) AS latest_modification,
    any(engine) AS engine
FROM system.parts
--WHERE active
GROUP BY
    database,
    table
ORDER BY bytes_size DESC

select concat(database, '.', table)                         as table,
       formatReadableSize(sum(bytes))                       as size,
       sum(rows)                                            as rows,
       max(modification_time)                               as latest_modification,
       sum(bytes)                                           as bytes_size,
       any(engine)                                          as engine,
       formatReadableSize(sum(primary_key_bytes_in_memory)) as primary_keys_size
from system.parts
--where active
group by database, table
order by bytes_size desc;

-- создание юзера
CREATE USER zowie IDENTIFIED WITH plaintext_password BY '!qazxsw2'

INSERT INTO db.metrics_0 (PE) VALUES
(5.12344)
(-1.1282)
(-2.1229)
(-3.124)
(-4.128)
INSERT INTO db.metrics_0 (PE) VALUES
(1.4214214)
(1046.4214214)
(4242.4214214)
(114242.421421445555)
(5.12344)
(8.099912344)

SELECT name, rows, min_time, max_time
FROM system.parts
WHERE table = 'metrics_0'

-- limit = количество строк для вставки
insert into db.metrics_0(PE)
select null -- rand() * 0.000000001
from system.numbers limit 1;


insert into clicks(date, user_id, banner_id)
select now() , number * 132 + 157, randomPrintableASCII(5)
from system.numbers limit 50;


Codec(Delta, ZSTD)


CREATE TABLE IF NOT EXISTS db.metrics_zsdt
(
    n Int32,
    -- Quantitative metrics
    CREATED_AT DateTime DEFAULT now() comment 'время появления метрики в таблице' CODEC(ZSTD),
    YYYYQ UInt16 DEFAULT formatDateTime(CREATED_AT, '%Y%Q') comment 'формат времени вида : год и номер текущего квартала' Codec(T64),
    COUNTRY LowCardinality(String) DEFAULT arrayElement(array('RUSSIA','USA','CHINA','GERMANY','IRELAND'), 1 + rand() % 5) comment 'Страна регистрации головного офиса компании' CODEC(ZSTD),
    INDUSTRY LowCardinality(String) DEFAULT arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5) comment 'Отрасль деятельности компании' CODEC(ZSTD),
    SECTOR LowCardinality(String) DEFAULT arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5) comment 'Сектор деятельности компании' CODEC(ZSTD),
    PE Float32 DEFAULT n comment 'Price over Earnings' CODEC(Gorilla, ZSTD),
    price Float32 DEFAULT n comment 'Price' CODEC(Gorilla, ZSTD),
    PBratio Float32 DEFAULT n comment 'Price over Book Value' CODEC(Gorilla, ZSTD),
    PriceToSalesRatio Float32 DEFAULT n comment 'Price over Sales' CODEC(Gorilla, ZSTD),
    PFCF Float32 DEFAULT n comment 'Price over FCF - Free Cash Flow' CODEC(Gorilla, ZSTD),
    PEG Float32 DEFAULT n comment 'Price over earningsGrowth' CODEC(Gorilla, ZSTD),
    PTBV Float32 DEFAULT n comment 'Price over TangibleBookValuePerShare = \n(totalStockholderEquity - goodWill - intangibleassets) / shareNumber' CODEC(Gorilla, ZSTD),
    PNCAV Float32 DEFAULT n comment 'Price over (totalAssets - totalLiab)' CODEC(Gorilla, ZSTD),
    EVEB Float32 DEFAULT n comment 'EnterpriseValue (EV) over EBITDA' CODEC(Gorilla, ZSTD),
    EVOCF Float32 DEFAULT n comment 'EnterpriseValue (EV) over OperatingCashFlow (OCF)' CODEC(Gorilla, ZSTD),
    EVtoSalesRatio Float32 DEFAULT n comment 'EnterpriseValue (EV) over Sales' CODEC(Gorilla, ZSTD),
    PEPE5LOW Float32 DEFAULT n comment '(PEcurrent / PE5year)low' CODEC(Gorilla, ZSTD),
    PEPE5HIGH Float32 DEFAULT n comment '(PEcurrent / PE5year)high' CODEC(Gorilla, ZSTD),
    PEPE15LOW Float32 DEFAULT n comment '(PEcurrent / PE15year)low' CODEC(Gorilla, ZSTD),
    PEPE15HIGH Float32 DEFAULT n comment '(PEcurrent / PE15year)high' CODEC(Gorilla, ZSTD),
    PEPE30LOW Float32 DEFAULT n comment '(PEcurrent / PE30year)low' CODEC(Gorilla, ZSTD),
    PEPE30HIGH Float32 DEFAULT n comment '(PEcurrent / PE30year)high' CODEC(Gorilla, ZSTD),
    MarginOfSafety UInt16 DEFAULT rand() Codec(T64),
    -- Health metrics
    CurrentRatio DECIMAL32(2) DEFAULT n,
    QuickRatio DECIMAL32(2) DEFAULT n,
    FlowRatio DECIMAL32(2) DEFAULT n,
    LiabilitiesToEquity Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    DebtToEquity Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    DebtToEbitda Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    DebtToNCAV Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    FCFS Float32 DEFAULT n comment 'Free Cash Flow over Sales' CODEC(Gorilla, ZSTD),
    -- Growth metrics
    EarningsYield UInt16 DEFAULT rand() Codec(T64),
    EbitdaYield UInt16 DEFAULT rand() Codec(T64),
    FCFyield UInt16 DEFAULT rand() comment 'Free Cash Flow Yield' Codec(T64),
    FPEoverTPE Float32 DEFAULT n comment 'Forward PE over Trailing PE' CODEC(Gorilla, ZSTD),
    OCFoverEPS Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    PEPE10LOW Float32 DEFAULT n comment '(PEcurrent / PE10year)low' CODEC(Gorilla, ZSTD),
    PEPE10HIGH Float32 DEFAULT n comment '(PEcurrent / PE10year)high' CODEC(Gorilla, ZSTD),
    -- Scores (Altman, Piotroski, Beneish)
    AltmanScore Float32 DEFAULT n  comment 'Altman Z-score' CODEC(Gorilla, ZSTD),
    PiotroskiScore Float32 DEFAULT n comment 'Piotroski Z-score' CODEC(Gorilla, ZSTD),
    BeneishScore Float32 DEFAULT n comment 'Beneish Z-score' CODEC(Gorilla, ZSTD),
    -- Risks (Overall)
    ShareHolderRightsRisk UInt8 DEFAULT arrayElement(array(1,4,6,8,10), 1 + rand() % 5) comment 'риск владения акциями' Codec(T64),
    OverallRisk UInt8 DEFAULT arrayElement(array(1,4,6,8,10), 1 + rand() % 5) comment 'общий риск' Codec(T64),
    RecommendationKey Enum8('sell' = -1, 'hold' = 0, 'buy' = 1) DEFAULT arrayElement(array('sell', 'buy','hold'), 1 + rand() % 3) comment 'Прогноз по акции : sell, buy, hold' CODEC(ZSTD)
)
ENGINE = MergeTree()--GenerateRandom(1, 5, 2)
PARTITION BY YYYYQ
ORDER BY YYYYQ


DROP TABLE  db.metrics_LZ40;
DROP TABLE  db.metrics_zsdt;
CREATE TABLE db.metrics_zsdt

insert into db.metrics_zsdt (n)
select rand() * 0.1 % 100 from numbers(10000000)
-- Elapsed: 19.938 sec. Processed 10.49 million rows, 83.88 MB (525.89 thousand rows/s., 4.21 MB/s.)
-- Elapsed: 21.102 sec. Processed 10.00 million rows, 80.00 MB (473.87 thousand rows/s., 3.79 MB/s.) 250000
-- Elapsed: 21.724 sec. Processed 10.00 million rows, 80.00 MB (460.33 thousand rows/s., 3.68 MB/s.) 100000
-- Elapsed: 19.391 sec. Processed 10.00 million rows, 80.00 MB (515.70 thousand rows/s., 4.13 MB/s.)
insert into db.metrics_zsdt (n)
select rand() * 0.1 % 1000 from numbers(50000000) settings max_block_size=1000000;
-- Elapsed: 129.567 sec. Processed 50.00 million rows, 400.00 MB (385.90 thousand rows/s., 3.09 MB/s.)
insert into db.metrics_zsdt (* EXCEPT(CREATED_AT, YYYYQ))
select rand() * 0.1 % 1000 from numbers(10000000) settings max_block_size=100000;

insert into db.metrics_LZ40 (n)
select rand() * 0.1 % 1000 from numbers(50000000) settings max_block_size=1000000;
-- Elapsed: 112.809 sec. Processed 50.00 million rows, 400.00 MB (443.23 thousand rows/s., 3.55 MB/s.)
insert into db.metrics_zsdt (n)
select rand() * 0.1 % 1000 from numbers(50000000) settings max_block_size=1000000;
-- Elapsed: 140.575 sec. Processed 50.00 million rows, 400.00 MB (355.68 thousand rows/s., 2.85 MB/s.)
insert into db.metrics_zsdt (n)
select rand() * 0.1 % 1000 from numbers(100000000) settings max_block_size=1000000;
-- Elapsed: 321.875 sec. Processed 100.00 million rows, 800.00 MB (310.68 thousand rows/s., 2.49 MB/s.)
insert into db.metrics_LZ40 (n)
select rand() * 0.1 % 1000 from numbers(100000000) settings max_block_size=1000000;
-- Elapsed: 272.508 sec. Processed 100.00 million rows, 800.00 MB (366.96 thousand rows/s., 2.94 MB/s.)

CREATE TABLE IF NOT EXISTS db.metrics_LZ40
(
    n Int32,
    -- Quantitative metrics
    CREATED_AT DateTime DEFAULT now() comment 'время появления метрики в таблице' CODEC(LZ4),
    YYYYQ UInt16 DEFAULT formatDateTime(CREATED_AT, '%Y%Q') comment 'формат времени вида : год и номер текущего квартала' Codec(T64),
    COUNTRY LowCardinality(String) DEFAULT arrayElement(array('RUSSIA','USA','CHINA','GERMANY','IRELAND'), 1 + rand() % 5) comment 'Страна регистрации головного офиса компании' CODEC(LZ4),
    INDUSTRY LowCardinality(String) DEFAULT arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5) comment 'Отрасль деятельности компании' CODEC(LZ4),
    SECTOR LowCardinality(String) DEFAULT arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5) comment 'Сектор деятельности компании' CODEC(LZ4),
    PE Float32 DEFAULT n comment 'Price over Earnings' CODEC(Gorilla, LZ4),
    price Float32 DEFAULT n comment 'Price' CODEC(Gorilla, LZ4),
    PBratio Float32 DEFAULT n comment 'Price over Book Value' CODEC(Gorilla, LZ4),
    PriceToSalesRatio Float32 DEFAULT n comment 'Price over Sales' CODEC(Gorilla, LZ4),
    PFCF Float32 DEFAULT n comment 'Price over FCF - Free Cash Flow' CODEC(Gorilla, LZ4),
    PEG Float32 DEFAULT n comment 'Price over earningsGrowth' CODEC(Gorilla, LZ4),
    PTBV Float32 DEFAULT n comment 'Price over TangibleBookValuePerShare = \n(totalStockholderEquity - goodWill - intangibleassets) / shareNumber' CODEC(Gorilla, LZ4),
    PNCAV Float32 DEFAULT n comment 'Price over (totalAssets - totalLiab)' CODEC(Gorilla, LZ4),
    EVEB Float32 DEFAULT n comment 'EnterpriseValue (EV) over EBITDA' CODEC(Gorilla, LZ4),
    EVOCF Float32 DEFAULT n comment 'EnterpriseValue (EV) over OperatingCashFlow (OCF)' CODEC(Gorilla, LZ4),
    EVtoSalesRatio Float32 DEFAULT n comment 'EnterpriseValue (EV) over Sales' CODEC(Gorilla, LZ4),
    PEPE5LOW Float32 DEFAULT n comment '(PEcurrent / PE5year)low' CODEC(Gorilla, LZ4),
    PEPE5HIGH Float32 DEFAULT n comment '(PEcurrent / PE5year)high' CODEC(Gorilla, LZ4),
    PEPE15LOW Float32 DEFAULT n comment '(PEcurrent / PE15year)low' CODEC(Gorilla, LZ4),
    PEPE15HIGH Float32 DEFAULT n comment '(PEcurrent / PE15year)high' CODEC(Gorilla, LZ4),
    PEPE30LOW Float32 DEFAULT n comment '(PEcurrent / PE30year)low' CODEC(Gorilla, LZ4),
    PEPE30HIGH Float32 DEFAULT n comment '(PEcurrent / PE30year)high' CODEC(Gorilla, LZ4),
    MarginOfSafety UInt16 DEFAULT rand() Codec(T64),
    -- Health metrics
    CurrentRatio DECIMAL32(2) DEFAULT n,
    QuickRatio DECIMAL32(2) DEFAULT n,
    FlowRatio DECIMAL32(2) DEFAULT n,
    LiabilitiesToEquity Float32 DEFAULT n CODEC(Gorilla, LZ4),
    DebtToEquity Float32 DEFAULT n CODEC(Gorilla, LZ4),
    DebtToEbitda Float32 DEFAULT n CODEC(Gorilla, LZ4),
    DebtToNCAV Float32 DEFAULT n CODEC(Gorilla, LZ4),
    FCFS Float32 DEFAULT n comment 'Free Cash Flow over Sales' CODEC(Gorilla, LZ4),
    -- Growth metrics
    EarningsYield UInt16 DEFAULT rand() Codec(T64),
    EbitdaYield UInt16 DEFAULT rand() Codec(T64),
    FCFyield UInt16 DEFAULT rand() comment 'Free Cash Flow Yield' Codec(T64),
    FPEoverTPE Float32 DEFAULT n comment 'Forward PE over Trailing PE' CODEC(Gorilla, LZ4),
    OCFoverEPS Float32 DEFAULT n CODEC(Gorilla, LZ4),
    PEPE10LOW Float32 DEFAULT n comment '(PEcurrent / PE10year)low' CODEC(Gorilla, LZ4),
    PEPE10HIGH Float32 DEFAULT n comment '(PEcurrent / PE10year)high' CODEC(Gorilla, LZ4),
    -- Scores (Altman, Piotroski, Beneish)
    AltmanScore Float32 DEFAULT n  comment 'Altman Z-score' CODEC(Gorilla, LZ4),
    PiotroskiScore Float32 DEFAULT n comment 'Piotroski Z-score' CODEC(Gorilla, LZ4),
    BeneishScore Float32 DEFAULT n comment 'Beneish Z-score' CODEC(Gorilla, LZ4),
    -- Risks (Overall)
    ShareHolderRightsRisk UInt8 DEFAULT arrayElement(array(1,4,6,8,10), 1 + rand() % 5) comment 'риск владения акциями' Codec(T64),
    OverallRisk UInt8 DEFAULT arrayElement(array(1,4,6,8,10), 1 + rand() % 5) comment 'общий риск' Codec(T64),
    RecommendationKey Enum8('sell' = -1, 'hold' = 0, 'buy' = 1) DEFAULT arrayElement(array('sell', 'buy','hold'), 1 + rand() % 3) comment 'Прогноз по акции : sell, buy, hold' CODEC(LZ4)
)
ENGINE = MergeTree()--GenerateRandom(1, 5, 2)
PARTITION BY YYYYQ
ORDER BY YYYYQ


















CREATE TABLE IF NOT EXISTS db.metrics_AAA0
(
    -- Quantitative metrics
    CREATED_AT DateTime DEFAULT now() comment 'время появления метрики в таблице',
    YYYYQ UInt16 DEFAULT formatDateTime(CREATED_AT, '%Y%Q') comment 'формат времени вида : год и номер текущего квартала' Codec(T64),
    COUNTRY LowCardinality(String) comment 'Страна регистрации головного офиса компании',
    INDUSTRY LowCardinality(String) comment 'Отрасль деятельности компании',
    SECTOR LowCardinality(String) comment 'Сектор деятельности компании',
    PE Float32 comment 'Price over Earnings' CODEC(Gorilla, LZ4),
    price Float32 comment 'Price' CODEC(Gorilla, LZ4),
    PBratio Float32 comment 'Price over Book Value' CODEC(Gorilla, LZ4),
    PriceToSalesRatio Float32 comment 'Price over Sales' CODEC(Gorilla, LZ4),
    PFCF Float32 comment 'Price over FCF - Free Cash Flow' CODEC(Gorilla, LZ4),
    PEG Float32 comment 'Price over earningsGrowth' CODEC(Gorilla, LZ4),
    PTBV Float32 comment 'Price over TangibleBookValuePerShare = \n(totalStockholderEquity - goodWill - intangibleassets) / shareNumber' CODEC(Gorilla, LZ4),
    PNCAV Float32 comment 'Price over (totalAssets - totalLiab)' CODEC(Gorilla, LZ4),
    EVEB Float32 comment 'EnterpriseValue (EV) over EBITDA' CODEC(Gorilla, LZ4),
    EVOCF Float32 comment 'EnterpriseValue (EV) over OperatingCashFlow (OCF)' CODEC(Gorilla, LZ4),
    EVtoSalesRatio Float32 comment 'EnterpriseValue (EV) over Sales' CODEC(Gorilla, LZ4),
    PEPE5LOW Float32 comment '(PEcurrent / PE5year)low' CODEC(Gorilla, LZ4),
    PEPE5HIGH Float32 comment '(PEcurrent / PE5year)high' CODEC(Gorilla, LZ4),
    PEPE15LOW Float32 comment '(PEcurrent / PE15year)low' CODEC(Gorilla, LZ4),
    PEPE15HIGH Float32 comment '(PEcurrent / PE15year)high' CODEC(Gorilla, LZ4),
    PEPE30LOW Float32 comment '(PEcurrent / PE30year)low' CODEC(Gorilla, LZ4),
    PEPE30HIGH Float32 comment '(PEcurrent / PE30year)high' CODEC(Gorilla, LZ4),
    MarginOfSafety UInt16 Codec(T64),
    -- Health metrics
    CurrentRatio DECIMAL32(2),
    QuickRatio DECIMAL32(2),
    FlowRatio DECIMAL32(2),
    LiabilitiesToEquity Float32 CODEC(Gorilla, LZ4),
    DebtToEquity Float32 CODEC(Gorilla, LZ4),
    DebtToEbitda Float32 CODEC(Gorilla, LZ4),
    DebtToNCAV Float32 CODEC(Gorilla, LZ4),
    FCFS Float32 comment 'Free Cash Flow over Sales' CODEC(Gorilla, LZ4),
    -- Growth metrics
    EarningsYield UInt16 Codec(T64),
    EbitdaYield UInt16 Codec(T64),
    FCFyield UInt16 comment 'Free Cash Flow Yield' Codec(T64),
    FPEoverTPE Float32 comment 'Forward PE over Trailing PE' CODEC(Gorilla, LZ4),
    OCFoverEPS Float32 CODEC(Gorilla, LZ4),
    PEPE10LOW Float32 comment '(PEcurrent / PE10year)low' CODEC(Gorilla, LZ4),
    PEPE10HIGH Float32 comment '(PEcurrent / PE10year)high' CODEC(Gorilla, LZ4),
    -- Scores (Altman, Piotroski, Beneish)
    AltmanScore Float32 comment 'Altman Z-score' CODEC(Gorilla, LZ4),
    PiotroskiScore Float32 comment 'Piotroski Z-score' CODEC(Gorilla, LZ4),
    BeneishScore Float32 comment 'Beneish Z-score' CODEC(Gorilla, LZ4),
    -- Risks (Overall)
    ShareHolderRightsRisk UInt8 comment 'риск владения акциями' Codec(T64),
    OverallRisk UInt8 comment 'общий риск' Codec(T64),
    RecommendationKey LowCardinality(String) comment 'Прогноз по акции : sell, buy, hold'
)
ENGINE = MergeTree()--GenerateRandom(1, 5, 2)
PARTITION BY YYYYQ
ORDER BY YYYYQ

select count() from db.metrics_AAA0

--TRUNCATE TABLE db.metrics_AAA0


insert into db.metrics_BBB0
(
COUNTRY,
INDUSTRY,
SECTOR,
PE,
price,
PBratio,
PriceToSalesRatio,
PFCF,
PEG,
PTBV,
PNCAV,
EVEB,
EVOCF,
EVtoSalesRatio,
PEPE5LOW,
PEPE5HIGH,
PEPE15LOW,
PEPE15HIGH,
PEPE30LOW,
PEPE30HIGH,
MarginOfSafety,
CurrentRatio,
QuickRatio,
FlowRatio,
LiabilitiesToEquity,
DebtToEquity,
DebtToEbitda,
DebtToNCAV,
FCFS,
EarningsYield,
EbitdaYield,
FCFyield,
FPEoverTPE,
OCFoverEPS,
PEPE10LOW,
PEPE10HIGH,
AltmanScore,
PiotroskiScore,
BeneishScore,
ShareHolderRightsRisk,
OverallRisk,
RecommendationKey
)
select
arrayElement(array('RUSSIA','USA','CHINA','GERMANY','IRELAND'), 1 + rand() % 5),
arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5),
arrayElement(array('IT','HEALTH','OIL','RETAIL','ATOMIC'), 1 + rand() % 5),
10.23455,
9.23455,
8.23455,
7.23455,
6.23455,
5.23455,
4.23455,
3.23455,
2.23455,
9.23455,
8.23455,
7.23455,
6.23455,
5.23455,
4.23455,
3.23455,
2.23455,
rand(),
9.23455,
8.23455,
7.23455,
6.23455,
5.23455,
4.23455,
3.23455,
2.23455,
rand(),
rand(),
rand(),
8.23455,
7.23455,
6.23455,
5.23455,
4.23455,
3.23455,
2.23455,
arrayElement(array(1,4,6,8,10), 1 + rand() % 5),
arrayElement(array(1,4,6,8,10), 1 + rand() % 5),
arrayElement(array('sell', 'buy','hold'), 1 + rand() % 3)
from system.numbers limit 10000000;


select count() from db.metrics_AAA0

select count() from db.metrics_BBB0



SELECT
    name,
    formatReadableSize(data_uncompressed_bytes) AS uncompressed,
    formatReadableSize(data_compressed_bytes) AS compressed,
    data_uncompressed_bytes / data_compressed_bytes AS compress_ratio
FROM system.columns
WHERE table = 'metrics_AAA0'


1 CODEC(ZSTD)
│ A      │ 33.70 MiB     │ 93.32 MiB    │
│ B      │ 56.60 MiB     │ 93.32 MiB
2 ZSTD(8) vs CODEC(LZ4HC)
┌─column─┬─bytes_on_disk─┬─uncompressed─┐
│ A      │ 33.79 MiB     │ 95.71 MiB    │
│ C      │ 47.72 MiB     │ 95.71 MiB    │
│ B      │ 58.07 MiB     │ 95.71 MiB    │
└────────┴───────────────┴──────────────┘
3 
A LowCardinality(String) CODEC(ZSTD(11)),
    B LowCardinality(String),
    C LowCardinality(String) CODEC(LZ4HC),
    D LowCardinality(String) CODEC(ZSTD(22))
┌─column─┬─bytes_on_disk─┬─uncompressed─┐
│ A      │ 34.32 MiB     │ 95.71 MiB    │
│ C      │ 47.72 MiB     │ 95.71 MiB    │
│ D      │ 31.75 MiB     │ 95.71 MiB    │
│ B      │ 58.08 MiB     │ 95.71 MiB    │
└────────┴───────────────┴──────────────┘

4 CODEC(Gorilla, LZ4) 

truncate table XXX1
DROP TABLE XXX1
create table XXX1 (
    B DateTime CODEC(DoubleDelta, LZ4),
    C DateTime CODEC(ZSTD(22))
) Engine=MergeTree order by tuple()
insert into XXX1 select 
now(),
now()
from numbers(100000000);

create table XXX1 (
    A Float32 CODEC(Gorilla, LZ4),
    B Float32 CODEC(Gorilla, ZSTD)
) Engine=MergeTree order by tuple()
insert into XXX1 select 
rand() * 0.1 % 10000,
rand() * 0.1 % 10000
from numbers(100000000); 

create table XXX1 (
    RecommendationKey Enum8('sell' = -1, 'buy' = 1, 'hold' = 0) comment 'RecommendationKey' CODEC(ZSTD)
) Engine=MergeTree order by tuple()
insert into XXX1 select 
rand() * 0.1 % 10000000,
rand() * 0.1 % 10000000
from numbers(100000000);

create table XXX1 (
    INDUSTRY LowCardinality(String) comment 'Отрасль деятельности компании' CODEC(ZSTD),
    SECTOR LowCardinality(String) comment 'Сектор деятельности компании' CODEC(ZSTD(11))
) Engine=MergeTree order by tuple()
insert into XXX1 select 
arrayElement(array('RUSSIA','USA','CHINA','GERMANY','IRELAND'), 1 + rand() % 5),
arrayElement(array('sell','buy','hold'), 1 + rand() % 3)
from numbers(100000000);


BeneishScore Float32 comment 'Beneish Z-score' CODEC(Gorilla, LZ4)

select column, formatReadableSize(sum(column_bytes_on_disk)) bytes_on_disk, formatReadableSize(sum(column_data_uncompressed_bytes)) uncompressed
from system.parts_columns 
where active = 1 and table like '%XXX%' 
group by database,table, column

SELECT
    concat(database, '.', table) AS table,
    formatReadableSize(sum(bytes)) AS size,
    sum(bytes) AS bytes_size,
    sum(rows) AS rows,
    max(modification_time) AS latest_modification,
    any(engine) AS engine
FROM system.parts
--WHERE active
GROUP BY
    database,
    table
ORDER BY bytes_size DESC









CREATE TABLE IF NOT EXISTS db.metrics_BBB0
(
    -- Quantitative metrics
    CREATED_AT DateTime DEFAULT now() NOT NULL comment 'время появления метрики в таблице',
    YYYYQ UInt16 DEFAULT formatDateTime(CREATED_AT, '%Y%Q') NOT NULL comment 'формат времени вида : год и номер текущего квартала' Codec(T64),
    COUNTRY LowCardinality(String) NOT NULL comment 'Страна регистрации головного офиса компании',
    INDUSTRY LowCardinality(String) NOT NULL comment 'Отрасль деятельности компании',
    SECTOR LowCardinality(String) NOT NULL comment 'Сектор деятельности компании',
    PE Float32 NOT NULL comment 'Price over Earnings' CODEC(Gorilla, LZ4),
    price Float32 NOT NULL comment 'Price' CODEC(Gorilla, LZ4),
    PBratio Float32 NOT NULL comment 'Price over Book Value' CODEC(Gorilla, LZ4),
    PriceToSalesRatio Float32 NOT NULL comment 'Price over Sales' CODEC(Gorilla, LZ4),
    PFCF Float32 NOT NULL comment 'Price over FCF - Free Cash Flow' CODEC(Gorilla, LZ4),
    PEG Float32 NOT NULL comment 'Price over earningsGrowth' CODEC(Gorilla, LZ4),
    PTBV Float32 NOT NULL comment 'Price over TangibleBookValuePerShare = \n(totalStockholderEquity - goodWill - intangibleassets) / shareNumber' CODEC(Gorilla, LZ4),
    PNCAV Float32 NOT NULL comment 'Price over (totalAssets - totalLiab)' CODEC(Gorilla, LZ4),
    EVEB Float32 NOT NULL comment 'EnterpriseValue (EV) over EBITDA' CODEC(Gorilla, LZ4),
    EVOCF Float32 NOT NULL comment 'EnterpriseValue (EV) over OperatingCashFlow (OCF)' CODEC(Gorilla, LZ4),
    EVtoSalesRatio Float32 NOT NULL comment 'EnterpriseValue (EV) over Sales' CODEC(Gorilla, LZ4),
    PEPE5LOW Float32 NOT NULL comment '(PEcurrent / PE5year)low' CODEC(Gorilla, LZ4),
    PEPE5HIGH Float32 NOT NULL comment '(PEcurrent / PE5year)high' CODEC(Gorilla, LZ4),
    PEPE15LOW Float32 NOT NULL comment '(PEcurrent / PE15year)low' CODEC(Gorilla, LZ4),
    PEPE15HIGH Float32 NOT NULL comment '(PEcurrent / PE15year)high' CODEC(Gorilla, LZ4),
    PEPE30LOW Float32 NOT NULL comment '(PEcurrent / PE30year)low' CODEC(Gorilla, LZ4),
    PEPE30HIGH Float32 NOT NULL comment '(PEcurrent / PE30year)high' CODEC(Gorilla, LZ4),
    MarginOfSafety UInt16 NOT NULL Codec(T64),
    -- Health metrics
    CurrentRatio DECIMAL32(2) NOT NULL,
    QuickRatio DECIMAL32(2) NOT NULL,
    FlowRatio DECIMAL32(2) NOT NULL,
    LiabilitiesToEquity Float32 NOT NULL CODEC(Gorilla, LZ4),
    DebtToEquity Float32 NOT NULL CODEC(Gorilla, LZ4),
    DebtToEbitda Float32 NOT NULL CODEC(Gorilla, LZ4),
    DebtToNCAV Float32 NOT NULL CODEC(Gorilla, LZ4),
    FCFS Float32 NOT NULL comment 'Free Cash Flow over Sales' CODEC(Gorilla, LZ4),
    -- Growth metrics
    EarningsYield UInt16 NOT NULL Codec(T64),
    EbitdaYield UInt16 NOT NULL Codec(T64),
    FCFyield UInt16 NOT NULL comment 'Free Cash Flow Yield' Codec(T64),
    FPEoverTPE Float32 NOT NULL comment 'Forward PE over Trailing PE' CODEC(Gorilla, LZ4),
    OCFoverEPS Float32 NOT NULL CODEC(Gorilla, LZ4),
    PEPE10LOW Float32 NOT NULL comment '(PEcurrent / PE10year)low' CODEC(Gorilla, LZ4),
    PEPE10HIGH Float32 NOT NULL comment '(PEcurrent / PE10year)high' CODEC(Gorilla, LZ4),
    -- Scores (Altman, Piotroski, Beneish)
    AltmanScore Float32 NOT NULL comment 'Altman Z-score' CODEC(Gorilla, LZ4),
    PiotroskiScore Float32 NOT NULL comment 'Piotroski Z-score' CODEC(Gorilla, LZ4),
    BeneishScore Float32 NOT NULL comment 'Beneish Z-score' CODEC(Gorilla, LZ4),
    -- Risks (Overall)
    ShareHolderRightsRisk UInt8 NOT NULL comment 'риск владения акциями' Codec(T64),
    OverallRisk UInt8 NOT NULL comment 'общий риск' Codec(T64),
    RecommendationKey LowCardinality(String) NOT NULL comment 'Прогноз по акции : sell, buy, hold'
)
ENGINE = MergeTree()--GenerateRandom(1, 5, 2)
PARTITION BY YYYYQ
ORDER BY YYYYQ