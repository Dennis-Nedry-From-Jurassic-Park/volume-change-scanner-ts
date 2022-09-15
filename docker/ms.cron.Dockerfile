ARG BUILDER_TAG
ARG builder=builder:${BUILDER_TAG}

FROM $builder as compiled

FROM node:18.8.0-alpine3.16 as ms-cron

RUN apk add --no-cache python3 make g++

WORKDIR /atr

COPY --from=compiled /atr/.env /atr/.root.dir /atr/assets/ /atr/
COPY --from=compiled /atr/assets/ /atr/assets/
COPY --from=compiled /atr/packages/backend/dist/apps/ms-cron/ /atr/packages/backend/apps/ms-cron/
COPY --from=compiled /atr/packages/backend/dist/apps/ms-base/ /atr/packages/backend/apps/ms-base/
COPY --from=compiled /atr/packages/backend/dist/apps/ms-ti-base/ /atr/packages/backend/apps/ms-ti-base/
COPY --from=compiled /atr/packages/backend/dist/apps/ms-trading-calendar/ /atr/packages/backend/apps/ms-trading-calendar/
COPY --from=compiled /atr/packages/backend/dist/apps/ms-change-price-strategy/ /atr/packages/backend/apps/ms-change-price-strategy/
COPY --from=compiled /atr/packages/backend/node_modules /atr/packages/backend/node_modules
COPY --from=compiled /atr/node_modules /atr/node_modules

CMD ["node", "--enable-source-maps", "packages/backend/apps/ms-cron/src/portfolio.js"]
