Docker commands:
```
sudo docker run -d --name some-clickhouse-server-2 --ulimit nofile=262144:262144 yandex/clickhouse-server:21.8.3.44
```
```
sudo docker run -it --rm --link some-clickhouse-server-2:clickhouse-server yandex/clickhouse-client:21.8.3.44 --host clickhouse-server
```


\\wsl$\docker-desktop-data\version-pack-data\community\docker\volumes\
\\wsl$\docker-desktop-data\version-pack-data\community\docker\volumes\
docker run -d --name clickhouse_host --ulimit nofile=262144:262144 -p 8123:8123 -v /clickhouse/log:/var/log/clickhouse-server -v /clickhouse/data:/var/lib/clickhouse yandex/clickhouse-server:21.3.20.1
docker run -it --rm --link clickhouse_host:clickhouse-server yandex/clickhouse-client:21.3.20.1 --host clickhouse-server --port 9000