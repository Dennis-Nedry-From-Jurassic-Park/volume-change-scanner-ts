FROM node:18.8.0-alpine3.16

RUN apk add --no-cache python3 make g++

WORKDIR /atr

COPY packages/backend/apps /atr/packages/backend/apps
COPY packages/backend/nest-cli.json /atr/packages/backend/
COPY /assets/ /atr/assets/
COPY .env .root.dir /atr/

RUN rm -rf /atr/dist

COPY --from=deps:0.0.14 /atr /atr

RUN yarn build:ms:cron
