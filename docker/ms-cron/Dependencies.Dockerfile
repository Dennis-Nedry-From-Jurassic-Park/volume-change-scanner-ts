ARG DEPENDENCIES_TAG=0.0.3

#FROM DEPENDENCIES_TAG
#docker pull alpine:3.16.2
FROM node:18.8.0-alpine3.16 as deps
#FROM ubuntu:kinetic-20220830 as deps

#https://hub.docker.com/_/alpine/tags
RUN apk add --no-cache python3 make g++
#RUN apt update && apt install -y unzip && apt install -y curl
#RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
#    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && apt install -y yarn


WORKDIR /atr

COPY package.json yarn.lock package.json /atr/
COPY packages/backend/package.json packages/backend/tsconfig.json packages/backend/tsconfig.build.json /atr/packages/backend/

RUN set -ex; \
  yarn install --prod --frozen-lockfile --non-interactive; \
  yarn cache clean;

#RUN zip -r -j /app/lambda.zip /app/dependencies/*
