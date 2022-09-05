let render = require('json-templater/string');


const backend_package_json: string = `
{
  "name": "{{name}}",
  "version": "0.0.1",
  "private": true,
  "license": "Apache-2.0",
  "scripts": {
    "build:ms:cron": "yarn nest build ms:cron",
    "build:ms:atr": "yarn nest build ms-atr",
    "start:ms:atr": "ts-node -r tsconfig-paths/register apps/ms-atr/src/automatic.trading.robot.ts",
    "start:ms:cron": "ts-node -r tsconfig-paths/register apps/ms-cron/src/portfolio.ts",
    "build:ms:prepare": "yarn nest build ms-change-price-strategy",
    "start:ms:prepare": "ts-node -r tsconfig-paths/register apps/ms-change-price-strategy/src/prepare-candles-sbpe-exchange-main-session.ts"
  },
  "dependencies": {
  },
  "devDependencies": {
  }
}
`;


const json = render(
    `{
        "name": "{{name}}",
        "version": "0.0.1",
        "private": true,
        "license": "Apache-2.0",
        "scripts": {
            "build:{{ms.cron}}": "yarn nest build {{ms.cron}}",
            "build:{{ms.atr}}": "yarn nest build {{ms.atr}}",
            "start:{{ms.atr}}": "yarn workspace {{name}} start:{{ms.atr}}",
            "start:{{ms.cron}}": "yarn workspace {{name}} start:{{ms.cron}}"
        },
        "dependencies": {},
        "devDependencies": {}
    }`, {
        name: '@atr/backend',
        ms: {
            cron: 'ms:cron',
            atr: 'ms:atr'
        }
    });


console.log(json)
