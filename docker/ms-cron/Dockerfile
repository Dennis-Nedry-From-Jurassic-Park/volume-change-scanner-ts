FROM node:18.8.0-alpine3.16

RUN apk add --no-cache python3 make g++

WORKDIR /atr

COPY packages/backend/apps /atr/packages/backend/apps
COPY packages/backend/nest-cli.json /atr/packages/backend/
COPY packages/backend/package.json /atr/packages/backend/
COPY packages/backend/tsconfig.build.json /atr/packages/backend/
COPY packages/backend/tsconfig.json /atr/packages/backend/
COPY package.json /atr/package.json
COPY .env /atr/.env
COPY assets /atr/assets/
COPY .root.dir /atr/.root.dir

RUN yarn install

RUN rm -rf /atr/dist

RUN yarn build:ms:atr
