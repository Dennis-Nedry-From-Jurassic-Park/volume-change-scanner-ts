work in progress (not for using)

# volume-change-scanner-ts

stocks monitoring via Tinkoff InvestAPI v2 (https://github.com/Tinkoff/investAPI)

command for generating *.ts files from proto contracts (folder protos):
```ts
npx protoc --ts_out ./protos_ts --proto_path protos protos/*.proto --ts_opt generate_dependencies
```
```ts
--ts_opt generate_dependencies is used for generating google/protobuf/timestamp.ts
```
tool for generating UML:
```ts
npx arkit src/ -o arkit.svg
```
Docker commands:
```
sudo docker run -d --name some-clickhouse-server-2 --ulimit nofile=262144:262144 yandex/clickhouse-server:21.8.3.44
```
```
sudo docker run -it --rm --link some-clickhouse-server-2:clickhouse-server yandex/clickhouse-client:21.8.3.44 --host clickhouse-server
```
