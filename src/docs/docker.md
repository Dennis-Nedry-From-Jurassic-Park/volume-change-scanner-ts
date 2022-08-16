Docker commands:
```
sudo docker run -d --name some-clickhouse-server-2 --ulimit nofile=262144:262144 yandex/clickhouse-server:21.8.3.44
```
```
sudo docker run -it --rm --link some-clickhouse-server-2:clickhouse-server yandex/clickhouse-client:21.8.3.44 --host clickhouse-server
```