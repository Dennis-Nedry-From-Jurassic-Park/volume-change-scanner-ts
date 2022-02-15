CREATE TABLE IF NOT EXISTS db.weights
(
    n Int32,
    TICKER LowCardinality(String) DEFAULT arrayElement(array('PLTR','ENDP','MSFT'), 1 + rand() % 3) comment 'company ticker' CODEC(ZSTD),
    -- Auxiliary fields
    CREATED_AT DateTime DEFAULT now() comment 'time of appearance of the metric' CODEC(ZSTD),
    YYYYQ UInt16 DEFAULT formatDateTime(CREATED_AT, '%Y%Q') comment 'time format: year (YYYY) and current quarter number(Q)' Codec(T64),
    -- Quantitative metrics
    CountryWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    SectorWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    peWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    pbWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    PriceToSalesRatioWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    PriceToSalesWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    PriceToSalesRatioTTMWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    PriceOverFCFweight Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    PegWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    PTBVweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    PNCAVweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    EVEBweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    EVtoEBITweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    EVoverOCFweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    EVtoSalesRatio Float32 DEFAULT n comment 'EnterpriseValue (EV) over Sales (Revenue)' CODEC(Gorilla, ZSTD),
    EVtoSalesRatioWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    price Float32 DEFAULT n CODEC(Gorilla, ZSTD),
    currency LowCardinality(String) DEFAULT 'USDRUB' CODEC(ZSTD),
    -- country LowCardinality(String) DEFAULT arrayElement(array('RUSSIA','USA','CHINA','GERMANY','IRELAND'), 1 + rand() % 5) CODEC(ZSTD),
    -- ------------------------------ Historical PE ------------------------------------
    -- PEPE5LOW Float32 DEFAULT n comment '(PEcurrent / PE5year)low' CODEC(Gorilla, ZSTD),
    -- PEPE5HIGH Float32 DEFAULT n comment '(PEcurrent / PE5year)high' CODEC(Gorilla, ZSTD),
    -- PEPE10LOW Float32 DEFAULT n comment '(PEcurrent / PE10year)low' CODEC(Gorilla, ZSTD),
    -- PEPE10HIGH Float32 DEFAULT n comment '(PEcurrent / PE10year)high' CODEC(Gorilla, ZSTD),
    -- ------------------------------ Health metrics -----------------------------------
    CurrentRatioWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    QuickRatioWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    FlowRatioWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    LiabilitiesToEquityWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    DebtToEquityWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    DebtToEbitdaWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    DebtToNCAVweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    LongTermDebtOverWorkingCapitalWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    FCFSweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    -- Efficiency metrics weights - https://blog.financemarker.ru/roic/
    ROEweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    ROAweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    ROTAweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    ROICweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    ROCEweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    -- Growth metrics weights
    EarningsYieldWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    EbitYieldWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    EbitdaYieldWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    FCFyieldWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    FPEoverTPEweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    OCFoverEPSweight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    -- Scores (Altman, Piotroski, Beneish)
    AltmanScoreWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    PiotroskiScoreWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    BeneishScoreWeight UInt8 DEFAULT n CODEC(Delta, ZSTD),
    -- Risks (Overall)
    ShareHolderRightsRisk UUInt8 DEFAULT arrayElement(array(1,4,6,8,10), 1 + rand() % 5) comment 'risk of shareholding.' Codec(Delta, ZSTD),
    OverallRisk UUInt8 DEFAULT arrayElement(array(1,4,6,8,10), 1 + rand() % 5) comment 'common risk' Codec(Delta, ZSTD),
    RecommendationKey Enum8('sell' = -1, 'hold' = 0, 'buy' = 1) DEFAULT arrayElement(array('sell', 'buy','hold'), 1 + rand() % 3) comment 'Stock prediction : sell, buy, hold' CODEC(ZSTD)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(CREATED_AT)
ORDER BY tuple()