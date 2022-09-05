#ARG DEPENDENCIES_TAG=0.0.1
#
##FROM DEPENDENCIES_TAG
#
#FROM node:18.8.0-alpine3.16 as deps
#
#RUN apk add --no-cache python3 make g++
#
#WORKDIR /atr
#
#COPY package.json yarn.lock /atr/
#COPY packages/backend/package.json /atr/packages/backend/
#COPY packages/backend/tsconfig.json /atr/packages/backend/
#COPY packages/backend/tsconfig.build.json /atr/packages/backend/
#
#RUN set -ex; \
#  yarn install --frozen-lockfile --non-interactive; \
#  yarn cache clean;

#ARG DEPENDENCIES_TAG

#FROM atr.dependencies:$DEPENDENCIES_TAG

FROM node:18.8.0-alpine3.16

RUN apk add --no-cache python3 make g++

WORKDIR /atr

COPY packages/backend/apps /atr/packages/backend/apps
COPY packages/backend/nest-cli.json /atr/packages/backend/
#COPY packages/backend/package.json /atr/packages/backend/
#COPY packages/backend/tsconfig.build.json /atr/packages/backend/
#COPY packages/backend/tsconfig.json /atr/packages/backend/
#COPY package.json /atr/package.json
COPY assets /atr/assets
COPY .env .root.dir assets /atr/

#RUN yarn install

RUN rm -rf /atr/dist

COPY --from=deps:0.0.2 /atr /atr

RUN yarn build:ms:cron
