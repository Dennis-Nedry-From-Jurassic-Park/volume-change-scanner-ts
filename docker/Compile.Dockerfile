FROM deps:0.0.14 as builder

WORKDIR /atr

COPY . .

RUN rm -rf /atr/packages/backend/dist

# COPY --from=deps:0.0.14 /atr /atr

RUN yarn build:ms:atr
RUN yarn build:ms:cron
