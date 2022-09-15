FROM deps:0.0.1 as builder

WORKDIR /atr

COPY . .

RUN rm -rf /atr/packages/backend/dist

RUN yarn build:ms:atr
RUN yarn build:ms:cron
