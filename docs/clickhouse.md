1) 
2) 
3) 
4) docker compose up -d
5) docker run -it --rm --link volume-change-scanner-ts-clickhouse1-1:clickhouse-server clickhouse/clickhouse-client:21.3.20.1 --host clickhouse-server --port 9000
   docker run -it --rm --link volume-change-scanner-ts-clickhouse:clickhouse-server clickhouse/clickhouse-client:21.3.20.1 --host clickhouse-server --port 9000
https://clickhouse.com/docs/en/interfaces/third-party/integrations/

https://github.com/GoogleChrome/lighthouse
https://github.com/vkcom/lighthouse
https://github.com/vkcom/kittenhouse
https://www.sequelpro.com/

windows:

https://stackoverflow.com/questions/43181654/locating-data-volumes-in-docker-desktop-windows
cd //wsl$/docker-desktop-data/version-pack-data/community/docker/volumes/


--------------------
https://github.com/Altinity/clickhouse-grafana/blob/master/docker-compose.yaml
https://github.com/lmangani/docker-clickhouse-grafana

https://onelinerhub.com/clickhouse/how-to-format-datetime
https://onelinerhub.com/clickhouse
https://github.com/lmangani/docker-clickhouse-grafana
https://mcs.mail.ru/docs/additionals/cases/cases-monitoring/case-node-exporter
https://clickhouse.com/docs/ru/sql-reference/functions/date-time-functions/

--------------------
perf:
https://altinitydb.medium.com/new-encodings-to-improve-clickhouse-efficiency-927678e496bd




dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart

wsl --install

wsl --set-default-version 2

wsl --install -d ubuntu

wsl.exe --set-version Ubuntu 2

sfc /scannow

https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-10#1-overview

create dir clickhouse_data

bash here

mkdir -p ./{data,etc,log}


\\wsl$\Ubuntu\clickhouse_data\log

docker run -d --name clickhouse_host --ulimit nofile=262144:262144 -p 8123:8123 -v \\wsl$\Ubuntu\clickhouse_data\log:/var/log/clickhouse-server -v \\wsl$\Ubuntu\clickhouse_da
ta\data:/var/lib/clickhouse yandex/clickhouse-server:21.3.20.1

docker run -it --rm --link clickhouse_host_2:clickhouse-server clickhouse/clickhouse-client:21.3.20.1 --host clickhouse-server --port 9000
https://kb.altinity.com/altinity-kb-setup-and-maintenance/clickhouse-versions/
https://hub.docker.com/r/clickhouse/clickhouse-server/tags
https://hub.docker.com/r/clickhouse/clickhouse-client/tags

docker pull clickhouse/clickhouse-server:22.8.1
docker pull clickhouse/clickhouse-client:21.3.20.1

---------------------------------------------------------------------------
docker run -d --name clickhouse_host_2 --ulimit nofile=262144:262144 -p 8123:8123 -v \\wsl$\Ubuntu\clickhouse_data\log:/var/log/clickhouse-server -v \\wsl$\Ubuntu\clickhouse_data\data:/var/lib/clickhouse clickhouse/clickhouse-server:22.8.1

docker run -it --rm --link clickhouse_host:clickhouse-server yandex/clickhouse-client:21.3.20.1 --host clickhouse-server --port 9000 --format_csv_delimiter=";" --query="INSERT INTO GetCandles (*) FORMAT CSV" < _350с.spbe.csv

---------------------------------------------------------------------------
docker run -it --rm --link clickhouse_host:clickhouse-server yandex/clickhouse-client:21.3.20.1 --host clickhouse-server --port 9000

https://gist.github.com/sanchezzzhak/511fd140e8809857f8f1d84ddb937015


cat 111.csv | curl 'http://localhost:8123/?query=INSERT%20INTO%20GetCandles%20FORMAT%20CSV' --data-binary @-
cat 111.csv | curl 'http://localhost:8123/?format_csv_delimiter=,&query=INSERT%20INTO%20GetCandles%20FORMAT%20CSV' --data-binary @-
-----------------------------
cat 111.csv | curl 'http://localhost:8123/?format_csv_delimiter=;&query=INSERT%20INTO%20GetCandles%20FORMAT%20CSV' --data-binary @-
-----------------------------
curl 'http://localhost:8123/?query=INSERT+INTO+GetCandles(*)+VALUES(data)%3b'


RHI,BBG000BS5DR2,57.1,57.1,57.1,57.1,9,1515594600,1,1,



docker run -it --rm --link clickhouse_host:clickhouse-server yandex/clickhouse-client:21.3.20.1 --host clickhouse-server --port 9000 --format_csv_delimiter=";" --query="INSERT INTO GetCandles (*) FORMAT CSV" < _350с.spbe.csv

cat _350с.spbe.csv | winpty docker run -it --rm --link clickhouse_host:clickhouse-server yandex/clickhouse-client:21.3.20.1 --host clickhouse-server --port 9000 --format_csv_delimiter=";" --query="INSERT INTO GetCandles FORMAT CSV";



https://stackoverflow.com/questions/37954203/clickhouse-data-import

https://clickhouse.com/docs/en/operations/system-tables/query_log/
https://clickhouse.com/docs/ru/operations/quotas/
https://clickhouse.com/docs/en/operations/troubleshooting/

-----------------------------------------------------------------------------

for file in *; do cat $file | curl 'http://localhost:8123/?format_csv_delimiter=;&query=INSERT%20INTO%20GetCandles%20FORMAT%20CSV' --data-binary @-; done

cat /home/dima/test_data_clickhouse/sw_hosts.csv | clickhouse-client --host=* -u * --password=**** --format_csv_delimiter="|" --query="use adm; INSERT INTO sw_hosts FORMAT CSV"

https://gist.github.com/hatarist/4fc7af52ffb2b2013e961eab5307807b
https://www.alibabacloud.com/help/en/clickhouse/latest/use-clickhouse-client-to-import-data
--------------------------------- PERFOMANCE --------------------------------
https://gist.github.com/sanchezzzhak/511fd140e8809857f8f1d84ddb937015

SELECT table,
    formatReadableSize(sum(bytes)) as size,
    min(min_date) as min_date,
    max(max_date) as max_date
    FROM system.parts
    WHERE active
GROUP BY table

GetCandles │ 1.57 GiB | 100mi rows | 2:38 sec

SELECT table, formatReadableSize(size) as size, rows, days, formatReadableSize(avgDaySize) as avgDaySize FROM (
SELECT
    table,
    sum(bytes) AS size,
    sum(rows) AS rows,
    min(min_date) AS min_date,
    max(max_date) AS max_date,
    (max_date - min_date) AS days,
    size / (max_date - min_date) AS avgDaySize
FROM system.parts
WHERE active
GROUP BY table
ORDER BY rows DESC
)


INSERT INTO GetCandles (*) select arrayElement(array('ENDP','CSCO','NVDA','AAPL','GOOGL'), 1 + rand() % 5), arrayElement(array('BBG000BBJQV1','BBG000BBJQV2','BBG000BBJQV3','BBG000BBJQV4','BBG000BBJQV5'), 1 + rand() % 5),[1 + rand() % 2],[1 + rand() % 2],[1 + rand() % 2],[1 + rand() % 2],[1 + rand() % 2],[1 + rand() % 2],[1 + rand() % 2],[1 + rand() % 2],1 + rand() % 2,now(),1 + rand() % 2,1 + rand() % 2 from system.numbers limit 25000000;
Elapsed: 4.642 sec. Processed 25.17 million rows, 201.32 MB (5.42 million rows/s., 43.37 MB/s.)

INSERT INTO GetCandles2 (*) select arrayElement(array('ENDP','CSCO','NVDA','AAPL','GOOGL'), 1 + rand() % 5), arrayElement(array('BBG000BBJQV1','BBG000BBJQV2','BBG000BBJQV3','BBG000BBJQV4','BBG000BBJQV5'), 1 + rand() % 5),1 + rand() % 2,1 + rand() % 2,1 + rand() % 2,1 + rand() % 2,1 + rand() % 2,now(),1 + rand() % 2,1 + rand() % 2 from system.numbers limit 25000000;
Elapsed: 2.708 sec. Processed 25.17 million rows, 201.32 MB (9.29 million rows/s., 74.34 MB/s.)

SELECT table,
formatReadableSize(sum(bytes)) as size,
min(min_date) as min_date,
max(max_date) as max_date
FROM system.parts
WHERE active
GROUP BY table

GetCandles2             │ 243.75 MiB │ 1970-01-01 │ 1970-01-01 │
GetCandles              │ 401.98 MiB │ 1970-01-01 │ 1970-01-01 |



-----------------------------------------------------------------------------

bash here

mkdir -p ./{data,etc,log}

https://hub.docker.com/r/yandex/clickhouse-server/tags?page=1&ordering=last_updated

docker pull yandex/clickhouse-server:21.3.20.1

docker pull yandex/clickhouse-client:21.3.20.1


docker run -d --name clickhouse_host --ulimit nofile=262144:262144 -p 8123:8123 -v /clickhouse/log:/var/log/clickhouse-server -v /clickhouse/data:/var/lib/clickhouse yandex/c
lickhouse-server:21.3.20.1

docker run -it --rm --link clickhouse_host:clickhouse-server yandex/clickhouse-client:21.3.20.1 --host clickhouse-server --port 9000

-----------------------------------------------------------------------------
sql usefull queries

select count (*) from GetCandles
select * from GetCandles where toDate(time) = '2022-08-17'
describe table GetCandles
optimize  table GetCandles
-----------------------------------------------------------------------------
SELECT query SETTINGS max_query_size=1000000000, http_max_uri_size=1000000000

https://clickhouse.com/docs/ru/operations/settings/settings/
https://github.com/TimonKK/clickhouse/issues/68


config: {
session_id                              : v4(),
session_timeout                         :  0,
output_format_json_quote_64bit_integers :  0,
enable_http_compression                 :  0,
database                                : '',
log_queries								:  1, // профилирование запросов, результат смотреть в system.log_queries
//http_max_uri_size: 1000000000,



		// max_query_size: 1000000000,
		// max_parser_depth: 1000000000,
		// max_bytes_to_read: 1000000000,
		// max_rows_to_read: 1000000000
	} 



USE atr
CREATE TABLE risk_per_deal_per_day (
timestamp DateTime,
accountId UInt32,
countDeals UInt8
)
ENGINE=MergeTree
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp)


CREATE DATABASE atr
USE atr
CREATE TABLE risk_per_deal_per_day (
timestamp String,
accountId UInt32,
countDeals UInt8
)
ENGINE=MergeTree
PARTITION BY timestamp
ORDER BY (timestamp)


docker run -d --name clickhouse_host --expose 8123 --ulimit nofile=262144:262144 -p 8123:8123 -v G:\docker-volumes\ch\atr\clickhouse_data\log:/var/log/clickhouse-server -v G:\docker-volumes\ch\atr\clickhouse_data\data:/var/lib/clickhouse yandex/clickhouse-server:21.3.20.1

docker run -v /path/on/host:/path/inside/container image


docker run -d --name clickhouse_host --expose 8123 --ulimit nofile=262144:262144 -p 8123:8123 \
-v G:\docker-volumes\clickhouse\atr\clickhouse_data\log:/var/log/clickhouse-server \
-v G:\docker-volumes\clickhouse\atr\clickhouse_data\data:/var/lib/clickhouse yandex/clickhouse-server:21.3.20.1 \

docker run -d --name clickhouse_host --expose 8123 --ulimit nofile=262144:262144 -p 8123:8123 \
-v ch/log:/var/log/clickhouse-server \
-v ch\atr\clickhouse_data\data:/var/lib/clickhouse yandex/clickhouse-server:21.3.20.1 \

 \
 \


docker run -d --name clickhouse_host --expose 8123 --ulimit nofile=262144:262144 -p 8123:8123 -v /clickhouse/log:/var/log/clickhouse-server:/var/log/clickhouse-server -v /clickhouse/data:/var/lib/clickhouse:/var/lib/clickhouse yandex/clickhouse-server:21.3.20.1


docker run -d --name clickhouse_host --expose 8123 --ulimit nofile=262144:262144 -p 8123:8123 \
-v G:\docker-volumes\clickhouse\atr\clickhouse_data\log:/var/log/clickhouse-server \
-v G:\docker-volumes\clickhouse\atr\clickhouse_data\data:/var/lib/clickhouse yandex/clickhouse-server:21.3.20.1


docker run -d --name clickhouse_host --expose 8123 --ulimit nofile=262144:262144 -p 8123:8123 \
-v G:\docker-volumes\ch\atr\clickhouse_data\log:/var/log/clickhouse-server \
-v G:\docker-volumes\ch\atr\clickhouse_data\data:/var/lib/clickhouse yandex/clickhouse-server:21.3.20.1 \


docker run -d --name clickhouse_host --ulimit nofile=262144:262144 -p 8123:8123 -p 9000:9000 -v /g/docker-volumes/clickhouse/atr/clickhouse_data/log:/var/log/clickhouse-se
rver -v /g/docker-volumes/clickhouse/atr/clickhouse_data/data:/var/lib/clickhouse yandex/clickhouse-server:21.3.20.1


docker rm -f 8b10559dbc6b2deeb42002e5946e3fb0ac4fab35e9a6135db978f88a82628103

docker container ls -a --filter status=exited --filter status=created

docker cp cec5299ed00f:/etc/clickhouse-server/users.xml .


CREATE USER <user> IDENTIFIED WITH PLAINTEXT_PASSWORD BY <pass>;
GRANT ALL PRIVILEGES ON test_atr.* TO zowie



SHOW DATABASES
DESCRIBE TABLES

CREATE DATABASE test_atr


docker run -d --name clickhouse_1 \
    --ulimit nofile=262144:262144 \
    -v /clickhouse/log:/var/log/clickhouse-server \
    -v /clickhouse/data:/var/lib/clickhouse \
    yandex/clickhouse-server:21.3.20.1



docker run -d --name clickhouse_1 \
    --ulimit nofile=262144:262144 \
    -v G:\docker-volumes\clickhouse\atr\clickhouse_data\log:/var/log/clickhouse-server \
    -v G:\docker-volumes\clickhouse\atr\clickhouse_data\data:/var/lib/clickhouse \
    yandex/clickhouse-server:21.3.20.1 \



docker run -d --name clickhouse_1 \
--ulimit nofile=262144:262144 \
-v /clickhouse/log:/var/log/clickhouse-server \
-v /clickhouse/data:/var/lib/clickhouse \
yandex/clickhouse-server:21.3.20.1


USE test_atr;
CREATE TABLE risk_per_deal_per_day (
timestamp DateTime,
accountId UInt32,
countDeals UInt8
)
ENGINE=MergeTree
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp)




#  execute an interactive bash shell on the container
docker-compose exec {container_name} bash
# docker exec -it {container_name} bash
or open throw docker desktop terminal

# install preferable text editor (i prefer using 'nano')
apt-get update
apt-get install nano

# open file users.xml in the editor
nano /etc/clickhouse-server/users.xml

..
<!-- User can create other users and grant rights to them. -->
<!-- <access_management>1</access_management> -->
..



SELECT *　FROM system.errors　WHERE value > 0　ORDER BY code ASC　LIMIT 1
UNKNOWN_IDENTIFIER │   47 │     1

insert into security(timestamp,id) select now(), 111 from system.numbers limit 2;



docker run -d --name clickhouse_host --ulimit nofile=262144:262144 -p 8123:8123 -v ch\atr\clickhouse_data\log:/var/log/clickhouse-server -v ch\atr\clickhouse_data\data:/var/lib/clickhouse yandex/clickhouse-server:21.3.20.1 \


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


INSERT INTO GetCandles (*) 
select
arrayElement(array('ENDP','CSCO','NVDA','AAPL','GOOGL'),
arrayElement(array('BBG000BBJQV1','BBG000BBJQV2','BBG000BBJQV3','BBG000BBJQV4','BBG000BBJQV5'),
[1 + rand() % 2],
[1 + rand() % 2],
[1 + rand() % 2],
[1 + rand() % 2],
[1 + rand() % 2],
[1 + rand() % 2],
[1 + rand() % 2],
[1 + rand() % 2],
1 + rand() % 2,
now(),
1 + rand() % 2,
1 + rand() % 2
from system.numbers limit 1;


~~INSERT INTO GetCandles (*) VALUES~~ 
('NVDA','BBG000BBJQV0',[168],[400000000],[181],[180000000],[166],[40000000],[180],[590000000],10141222,'2022-08-10 07:00:00',1,5)




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