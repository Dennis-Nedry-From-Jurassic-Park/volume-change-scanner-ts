docker images -a | grep none | awk '{ print $3; }' | xargs docker rmi

docker exec -i -t ms_cron ls -alF /app
docker exec -i -t ms_cron ls -alF /atr/packages/backend

npm config set script-shell "C:\\Program Files\\Git\\bin\\bash.exe"
npm config delete script-shell
npm config ls -l | grep shell


cache yarn:
https://gist.github.com/armand1m/b8061bcc9e8e9a5c1303854290c7d61e
https://github.com/maku693/nextjs-docker/blob/main/Dockerfile.dev-shm-yarn-cache
https://github.com/ScribeMD/docker-cache
https://github.com/seatgeek/docker-build-cacher


https://stackoverflow.com/questions/65272764/ports-are-not-available-listen-tcp-0-0-0-0-50070-bind-an-attempt-was-made-to

netsh interface ipv4 show excludedportrange protocol=tcp
windows 10 ports problem

netsh int ipv4 set dynamic tcp start=49152 num=16384
netsh int ipv4 set dynamic tcp start=9200 num=2


As per Docker issue for windows https://github.com/docker/for-win/issues/3171 :

You might have that port in any of the excluded port ranges of command netsh interface ipv4 show excludedportrange protocol=tcp

You can use solution mentioned in the above ticket.

Disable hyper-v (which will required a couple of restarts)

dism.exe /Online /Disable-Feature:Microsoft-Hyper-V

After finishing all the required restarts, reserve the port you want so hyper-v doesn't reserve it back

netsh int ipv4 add excludedportrange protocol=tcp startport=8000 numberofports=1205

Re-Enable hyper-V (which will require a couple of restart)

dism.exe /Online /Enable-Feature:Microsoft-Hyper-V /All

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


