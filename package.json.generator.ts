import {asyncWriteFilef, getAppRootDir} from "@atr/backend/apps/ms-base/src/utility-methods/file";

let render = require('json-templater/string');

const exec = async () => {
    let re = /\-/gi;

    const name = '@atr/backend';
    const cron_ = 'ms-cron';
    const cron = cron_.replace(re, ':');
    const atr_ = 'ms-atr';
    const atr = atr_.replace(re, ':');
    const prepare_candles_spbe_exchange_main_session_ = 'ms-prepare-candles-spbe-exchange-main-session';
    const prepare_candles_spbe_exchange_main_session = prepare_candles_spbe_exchange_main_session_.replace(re, ':');

    const change = {
        name: name,
        ms: {
            cron: cron,
            atr: atr,
            prepare_candles_spbe_exchange_main_session: prepare_candles_spbe_exchange_main_session,
        }
    }

    const root_json = render(
`{
    "name": "volume-change-scanner-ts",
    "version": "0.1.0",
    "private": true,
    "standard": "ignore",
    "author": "",
    "license": "Apache-2.0",
    "workspaces": [
        "packages/libs/**",
        "packages/backend/**"
    ],
    "scripts": {
        "docker:run:stop:all": "docker stop $(docker ps -a -q)",
        "docker:run:ms:app": "docker-compose -f docker-compose.yml up -d",
        "docker:down:{{ms.cron}}": "docker-compose -f docker-compose-cron.yml down --remove-orphans",
        "docker:tag:{{ms.cron}}": "docker tag a9ee625926d49177b1c82db82111facff7ec3e2c4746ca9bfc6980f2896ec4e5 deps:0.0.2",
    
        "docker:build:{{ms.cron}}": "docker build . --no-cache --progress=tty -f docker/${cron_}/Dependencies.Dockerfile",
        "docker:run:{{ms.cron}}": "docker-compose -f docker-compose-cron.yml up -d --quiet-pull --build ms_cron",
    
        "build:{{ms.atr}}": "yarn workspace {{name}} build:{{ms.atr}}",
        "build:{{ms.cron}}": "yarn workspace {{name}} build:{{ms.cron}}",
        "build:{{ms.prepare_candles_spbe_exchange_main_session}}": "yarn workspace {{name}} build:{{ms.prepare_candles_spbe_exchange_main_session}}",
        "start:{{ms.atr}}": "yarn workspace {{name}} start:{{ms.atr}}",
        "start:{{ms.cron}}": "yarn workspace {{name}} start:{{ms.cron}}",
        "start:{{ms.prepare_candles_spbe_exchange_main_session}}": "yarn workspace {{name}} start:{{ms.prepare_candles_spbe_exchange_main_session}}",
        
        
        "api-ti-orders": "ts-node packages/backend/apps/ms-atr/src/api.ti.orders.ts",
        
        "build": "nest build",
        "start": "nest start",
        "start:dev": "nest start --watch",
        "start:debug": "nest start --debug --watch",
        
        "lint": "eslint --color --fix --ext .ts,.js,.jsx packages/backend/apps/ms-src/src",
        "lint-q": "eslint --color --fix --quiet --ext .ts,.js,.jsx packages/backend/apps/${cron_}/src",
        "test": "jest"
    },
    "dependencies": {
        "json-templater": "^1.2.0",
        "rxjs": "^7.5.6"
    },
    "browserslist": {
        "production": [
          ">0.2%",
          "not dead",
          "not op_mini all"
        ],
        "development": [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ]
    }
}`, change);

    await asyncWriteFilef(getAppRootDir()+'\\package.json', root_json)

    const packages_backend_package = render(
`{
    "name": "@atr/backend",
    "version": "0.0.1",
    "private": true,
    "license": "Apache-2.0",
    "scripts": {
        "build:{{ms.atr}}": "yarn nest build ${atr_}",
        "build:{{ms.cron}}": "yarn nest build ${cron_}",
        "build:{{ms.prepare_candles_spbe_exchange_main_session}}": "yarn nest build ${prepare_candles_spbe_exchange_main_session_}",
        "start:{{ms.atr}}": "ts-node -r tsconfig-paths/register apps/${atr_}/src/automatic.trading.robot.ts",
        "start:{{ms.cron}}": "ts-node -r tsconfig-paths/register apps/${cron_}/src/portfolio.ts",
        "start:{{ms.prepare_candles_spbe_exchange_main_session}}": "ts-node -r tsconfig-paths/register apps/ms-change-price-strategy/src/prepare-candles-spbe-exchange-main-session.ts"
    },
    "dependencies": {
        "@babel/plugin-transform-modules-commonjs": "^7.18.6",
        "@extra-number/compare": "^2.0.27",
        "@ladjs/graceful": "^3.0.2",
        "@lexriver/array-methods": "^1.0.2",
        "@nestjs/axios": "^0.1.0",
        "@nestjs/common": "^9.0.11",
        "@nestjs/config": "^2.2.0",
        "@nestjs/core": "^9.0.11",
        "@nestjs/mapped-types": "^1.1.0",
        "@nestjs/microservices": "^9.0.11",
        "@nestjs/platform-express": "^9.0.11",
        "@nestjs/platform-fastify": "^9.0.11",
        "@nestjs/schedule": "^2.1.0",
        "@nestjs/terminus": "^9.1.1",
        "@tdjsnelling/isolation-forest": "^0.0.8",
        "@types/cron": "^2.0.0",
        "@types/yauzl": "^2.10.0",
        "@willsoto/nestjs-prometheus": "^4.7.0",
        "aoot": "^0.2.0",
        "array-subtract": "^2.0.0",
        "block-parser": "^1.0.1",
        "bottleneck": "^2.19.5",
        "cache-manager": "^4.1.0",
        "cache-manager-redis-store": "^2.0.0",
        "catch-decorator-ts": "^0.0.3",
        "cli-table": "^0.3.11",
        "clickhouse": "^2.5.1",
        "connect-prometheus": "^1.0.2",
        "csv-split-stream": "^1.0.2",
        "delayed-promise-retry": "^0.0.4",
        "dotenv": "^16.0.1",
        "express": "^4.18.1",
        "extra-number": "^2.2.41",
        "fast-sort": "^3.2.0",
        "finnhub": "^1.2.15",
        "generate-schema": "^2.6.0",
        "integer": "^4.0.0",
        "interval-tree-type": "^1.0.1",
        "investing-com-api": "^3.5.0",
        "ioredis": "^5.2.2",
        "isolation-forest": "^0.0.9",
        "jest-ts-auto-mock": "^2.1.0",
        "json-templater": "^1.2.0",
        "limiter": "^2.1.0",
        "ml-isolation-forest": "^0.1.0",
        "moment": "^2.29.4",
        "moment-business-days": "^1.2.0",
        "moment-timezone": "^0.5.34",
        "n-readlines": "^1.0.1",
        "nestjs-throttler-storage-redis": "0.1.20",
        "object-sizeof": "^1.6.3",
        "ohlc-resample": "^1.1.3",
        "outlier": "^0.0.1",
        "outliers": "^0.0.3",
        "outliers-lizia": "^0.0.2",
        "package": "^1.0.1",
        "peirce-criterion": "^1.1.0",
        "performant-array-to-tree": "^1.11.0",
        "prom-client": "^14.1.0",
        "prometheus-api-metrics": "^3.2.2",
        "rbush": "^3.0.1",
        "redis": "^4.2.0",
        "reflect-metadata": "^0.1.13",
        "rimraf": "^3.0.2",
        "rxjs": "^7.5.6",
        "safe-mock": "^0.2.11",
        "stats-analysis": "^2.0.0",
        "strong-mock": "^7.3.0",
        "structures-wiz": "^1.1.13",
        "supertrend-indicator": "^1.0.6",
        "ta.js": "^1.11.3",
        "technicalindicators": "^3.1.0",
        "telegraf": "^4.8.6",
        "tinkoff-invest-api": "^5.0.0",
        "ts-jest": "^28.0.8",
        "ts-node": "^10.9.1",
        "ts-patch": "^2.0.2",
        "ttypescript": "^1.5.13",
        "uuid": "^8.3.2",
        "winston": "^3.8.1",
        "winston-daily-rotate-file": "^4.7.1",
        "wrr-pool": "^1.1.4",
        "yauzl": "^2.10.0"
    },
    "devDependencies": {
        "@babel/core": "^7.18.10",
        "@babel/preset-env": "^7.18.10",
        "@babel/preset-typescript": "^7.18.6",
        "@nestjs/cli": "^9.0.0",
        "@swc/core": "^1.2.237",
        "@swc/jest": "^0.2.22",
        "@types/bull": "^3.15.9",
        "@types/cache-manager": "^4.0.1",
        "@types/cache-manager-redis-store": "^2.0.1",
        "@types/express": "^4.17.13",
        "@types/jest": "^28.1.7",
        "@types/mocha": "^9.1.1",
        "@types/node": "18.7.6",
        "@types/uuid": "^8.3.4",
        "@typescript-eslint/eslint-plugin": "^5.33.1",
        "adm-zip": "^0.5.9",
        "arkit": "^1.6.4",
        "babel-jest": "^28.1.3",
        "benny": "^3.7.1",
        "jest": "^28.1.3",
        "jsontosql2": "^0.0.7",
        "ts-auto-mock": "^3.6.2",
        "ts-node": "^10.9.1",
        "typescript": "^4.7.4"
    }
}`, change);

    await asyncWriteFilef(getAppRootDir()+'\\packages\\backend\\package.json', packages_backend_package)

    const packages_backend_tsconfig = render(
`{
  "compilerOptions": {
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "alwaysStrict": true,
    "checkJs": false,
    "declaration": true,
    "diagnostics": false,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "preserve",
    "lib": [
      "es2019.array",
      "dom.iterable",
      "DOM",
      "es2020",
      "es2021",
      "ES2021.String",
      "esnext",
      "es6"
    ],
    "resolveJsonModule": true,
    "removeComments": true,
    "isolatedModules": false,
    "incremental": true,
    "importHelpers": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "module": "CommonJS",
    "moduleResolution": "node",
    "noEmit": false,
    "noImplicitAny": false,
    "noImplicitThis": false,
    "skipLibCheck": true,
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "sourceMap": true,
    "target": "esnext",
    "types": [
      "node",
      "@types/jest"
    ],
    "typeRoots": [
      "node_modules/@types/"
    ],
    "plugins": [
      {
        "transform": "ts-auto-mock/transformer",
        "cacheBetweenTests": false,
        "features": [
          "random"
        ]
      }
    ],
    "pretty": true
  },
  "exclude": [
    ".cache.ti.api.gs.ru.shares.report",
    "node_modules",
    "arch-diagramms",
    "dist",
    "test",
    "build",
    "output",
    "logs",
    "benchmark",
    "typings",
    "**/tests/*.test.ts",
    "*.test.ts"
  ],
  "paths": {
    "@${cron_}/*": [
      "apps/${cron_}/src/*"
    ],
    "@${atr_}/*": [
      "apps/${atr_}/src/*"
    ],
    "@${prepare_candles_spbe_exchange_main_session_}/*": [
      "apps/ms-change-price-strategy/src/*"
    ]
  }
}
`, change);

    await asyncWriteFilef(getAppRootDir()+'\\packages\\backend\\tsconfig.json', packages_backend_tsconfig);


}
exec();
