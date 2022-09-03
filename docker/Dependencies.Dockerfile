ARG DEPENDENCIES_TAG=0.0.1

#FROM DEPENDENCIES_TAG

FROM node:18.8.0-alpine3.16 as deps

RUN apk add --no-cache python3 make g++

WORKDIR /atr

COPY ./package.json /atr/package.json
COPY ./yarn.lock /atr/yarn.lock
COPY packages/backend/package.json /atr/packages/backend/
COPY packages/backend/tsconfig.json /atr/packages/backend/
COPY packages/backend/tsconfig.build.json /atr/packages/backend/

RUN set -ex; \
  yarn install --frozen-lockfile --non-interactive; \
  yarn cache clean;