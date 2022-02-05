# volume-change-scanner-ts

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
