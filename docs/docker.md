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


https://github.com/pavlovdog/grafana-prometheus-node-js-example

https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes-ru


docker-compose up -d --build --force-recreate --always-recreate-deps --renew-anon-volumes
docker-compose down && docker-compose pull && docker-compose build && docker-compose up -d
https://learntutorials.net/ru/docker/topic/1333/%D0%BE%D1%82%D0%BB%D0%B0%D0%B4%D0%BA%D0%B0-%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%B9%D0%BD%D0%B5%D1%80%D0%B0


docker-compose down && docker-compose pull && docker-compose build && docker-compose up -d


https://docs.docker.com/compose/compose-file/compose-file-v3/

docker-compose rm -f
docker-compose pull
docker-compose up --build -d
# Run some tests
./tests
docker-compose stop -t 1


http://pushorigin.ru/docker/debug

