FROM node:18.8.0-alpine3.16 as deps

RUN apk add --no-cache python3 make g++

WORKDIR /atr

COPY package.json yarn.lock package.json /atr/
COPY packages/backend/package.json packages/backend/tsconfig.json packages/backend/tsconfig.build.json /atr/packages/backend/

RUN set -ex; \
    yarn install --prod --frozen-lockfile --non-interactive; \
    yarn cache clean;
