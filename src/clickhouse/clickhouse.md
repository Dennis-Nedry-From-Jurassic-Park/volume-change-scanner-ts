windows:

https://stackoverflow.com/questions/43181654/locating-data-volumes-in-docker-desktop-windows
cd //wsl$/docker-desktop-data/version-pack-data/community/docker/volumes/

bash here

mkdir -p ./{data,etc,log}

https://hub.docker.com/r/yandex/clickhouse-server/tags?page=1&ordering=last_updated

docker pull yandex/clickhouse-server:21.3.20.1

docker pull yandex/clickhouse-client:21.3.20.1

docker run -d --name clickhouse_1 \
    --ulimit nofile=262144:262144 \
    -v /clickhouse/log:/var/log/clickhouse-server \
    -v /clickhouse/data:/var/lib/clickhouse \
    yandex/clickhouse-server:21.3.20.1

docker run -it --rm --link clickhouse_1:clickhouse-server yandex/clickhouse-client:21.3.20.1 --host clickhouse-server

SELECT now()
SELECT version()

CREATE TABLE security (timestamp DateTime,id UInt32) ENGINE=MergeTree PARTITION BY toYYYYMM(timestamp) ORDER BY (id, timestamp)


insert into security(timestamp,id) select now(), 111 from system.numbers limit 2;

CREATE TABLE security (
  timestamp DateTime,
  id UInt32,
  value Float32
)
ENGINE=MergeTree
PARTITION BY toYYYYMM(timestamp)
ORDER BY (id, timestamp)
You can downsample to one-minute intervals with a query like the following:

SELECT 
  id, minute, max(value) AS high, min(value) AS low, avg(value) AS avg,
  arrayElement(arraySort((x,y)->y, 
    groupArray(value), groupArray(timestamp)), 1) AS first,
  arrayElement(arraySort((x,y)->y, 
    groupArray(value), groupArray(timestamp)), -1) AS last
FROM security
GROUP BY id, toStartOfMinute(timestamp) AS minute
ORDER BY minute



CREATE TABLE IF NOT EXISTS historical_candles_temp_mem2 ( \
    dateTime DateTime, \
    closeTime Int64, \
    open Float64, \
    high Float64, \
    low Float64, \
    close Float64, \
    volume Float64, \
    kline_type String, \
    ticker String \
) ENGINE = Memory \


 
     
companies_temp_mem (figi,ticker,classCode,isin,lot,currency,shortEnabledFlag,name,exchange,countryOfRisk,sector)











insert into historical_candles_temp_mem (n) \
select rand() * 0.1 % 100 from numbers(1)



insert into historical_candles_temp_mem \
( \
dateTime, \
closeTime, \
    open, \
    high, \
    low, \
    close, \
    volume, \
    kline_type, \
    ticker \
) \
select \
now(), \
111, \
1.23455, \
9.23455, \
0.23455, \
8.23455, \
1111111, \
arrayElement(array('1mi','5mi','15mi','1H','1D'), 1 + rand() % 5), \
arrayElement(array('ENDP','CSCO'), 1 + rand() % 2) \
from system.numbers limit 8; \









insert into historical_candles_temp_mem \
( \
dateTime, \
closeTime, \
    open, \
    high, \
    low, \
    close, \
    volume, \
    kline_type, \
    ticker \
) \
select \
now(), \
round(rand() *0.000000001 % 100, 2), \
round(rand() *0.000000001 % 100, 2), \
round(rand() *0.000000001 % 100, 2), \
round(rand() *0.000000001 % 100, 2), \
round(rand() *0.000000001 % 100, 2), \
round(rand() *0.000000001 % 100, 2), \
arrayElement(array('5mi','1H','1D'), 1 + rand() % 3), \
arrayElement(array('ENDP','CSCO'), 1 + rand() % 2) \
from system.numbers limit 10; \



SELECT \
groupArray(open), \
kline_type AS TF, \
ticker \
FROM historical_candles_temp_mem \
GROUP BY ticker, kline_type

TRUNCATE TABLE IF EXISTS historical_candles_temp_mem



┌────────────dateTime─┬─closeTime─┬─open─┬─high─┬──low─┬─close─┬─volume─┬─kline_type─┬─ticker─┐
│ 2022-05-23 14:56:09 │         1 │  1.9 │  1.9 │  1.9 │   1.9 │    1.9 │ 5mi        │ CSCO   │
│ 2022-05-23 14:56:09 │         0 │ 0.59 │ 0.59 │ 0.59 │  0.59 │   0.59 │ 5mi        │ ENDP   │
│ 2022-05-23 14:56:09 │         0 │ 0.06 │ 0.06 │ 0.06 │  0.06 │   0.06 │ 5mi        │ ENDP   │
│ 2022-05-23 14:56:09 │         0 │ 0.26 │ 0.26 │ 0.26 │  0.26 │   0.26 │ 1D         │ ENDP   │
│ 2022-05-23 14:56:09 │         3 │ 3.13 │ 3.13 │ 3.13 │  3.13 │   3.13 │ 1H         │ ENDP   │
│ 2022-05-23 14:56:09 │         2 │  2.9 │  2.9 │  2.9 │   2.9 │    2.9 │ 5mi        │ CSCO   │
│ 2022-05-23 14:56:09 │         2 │ 2.85 │ 2.85 │ 2.85 │  2.85 │   2.85 │ 5mi        │ ENDP   │
│ 2022-05-23 14:56:09 │         2 │ 2.87 │ 2.87 │ 2.87 │  2.87 │   2.87 │ 5mi        │ ENDP   │
│ 2022-05-23 14:56:09 │         0 │ 0.21 │ 0.21 │ 0.21 │  0.21 │   0.21 │ 1D         │ ENDP   │
│ 2022-05-23 14:56:09 │         1 │ 1.46 │ 1.46 │ 1.46 │  1.46 │   1.46 │ 1H         │ ENDP   │
└─────────────────────┴───────────┴──────┴──────┴──────┴───────┴────────┴────────────┴────────┘
┌─groupArray(open)──────┬─TF──┬─ticker─┐
│ [3.13,1.46]           │ 1H  │ ENDP   │
│ [0.59,0.06,2.85,2.87] │ 5mi │ ENDP   │
│ [0.26,0.21]           │ 1D  │ ENDP   │
│ [1.9,2.9]             │ 5mi │ CSCO   │
└───────────────────────┴─────┴────────┘

┌─open──────────────────┬─high──────────────────┬─TF──┬─ticker─┐
│ [3.13,1.46]           │ [3.13,1.46]           │ 1H  │ ENDP   │
│ [0.59,0.06,2.85,2.87] │ [0.59,0.06,2.85,2.87] │ 5mi │ ENDP   │
│ [0.26,0.21]           │ [0.26,0.21]           │ 1D  │ ENDP   │
│ [1.9,2.9]             │ [1.9,2.9]             │ 5mi │ CSCO   │
└───────────────────────┴───────────────────────┴─────┴────────┘

SELECT \
groupArray(open) as open, \
groupArray(high) as high, \
kline_type AS TF, \
ticker \
FROM historical_candles_temp_mem \
GROUP BY ticker, kline_type























┌────────────dateTime─┬─closeTime─┬────open─┬────high─┬─────low─┬───close─┬──volume─┬─kline_type─┬─ticker─┐
│ 2022-05-23 13:43:00 │       111 │ 1.23455 │ 9.23455 │ 0.23455 │ 8.23455 │ 1111111 │ 1H         │ ENDP   
│
│ 2022-05-23 13:43:00 │       111 │ 1.23455 │ 9.23455 │ 0.23455 │ 8.23455 │ 1111111 │ 1H         │ ENDP   
│
│ 2022-05-23 13:43:00 │       111 │ 1.23455 │ 9.23455 │ 0.23455 │ 8.23455 │ 1111111 │ 1D         │ CSCO   
│
│ 2022-05-23 13:43:00 │       111 │ 1.23455 │ 9.23455 │ 0.23455 │ 8.23455 │ 1111111 │ 1H         │ CSCO   
│
│ 2022-05-23 13:43:00 │       111 │ 1.23455 │ 9.23455 │ 0.23455 │ 8.23455 │ 1111111 │ 1mi        │ ENDP   
│
│ 2022-05-23 13:43:00 │       111 │ 1.23455 │ 9.23455 │ 0.23455 │ 8.23455 │ 1111111 │ 5mi        │ ENDP   
│
│ 2022-05-23 13:43:00 │       111 │ 1.23455 │ 9.23455 │ 0.23455 │ 8.23455 │ 1111111 │ 1H         │ ENDP   
│
│ 2022-05-23 13:43:00 │       111 │ 1.23455 │ 9.23455 │ 0.23455 │ 8.23455 │ 1111111 │ 1D         │ ENDP   
│
└─────────────────────┴───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴────────────┴────────

┌─groupArray(open)──────────┬─TF──┬─ticker─┐
│ [1.23455]                 │ 1H  │ CSCO   │
│ [1.23455]                 │ 1D  │ CSCO   │
│ [1.23455,1.23455,1.23455] │ 1H  │ ENDP   │
│ [1.23455]                 │ 1mi │ ENDP   │
│ [1.23455]                 │ 5mi │ ENDP   │
│ [1.23455]                 │ 1D  │ ENDP   │
└───────────────────────────┴─────┴────────┘