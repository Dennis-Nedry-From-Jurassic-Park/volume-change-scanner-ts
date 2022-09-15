ARG BUILDER_TAG
ARG builder=builder:${BUILDER_TAG}

FROM $builder as compiled

FROM node:18.8.0-alpine3.16

RUN apk add --no-cache python3 make g++

#FROM builder:$BUILDER_TAG AS compiled
#
#RUN apk add --no-cache python3 make g++

WORKDIR /atr

#COPY packages/backend/apps /atr/packages/backend/apps
#COPY packages/backend/nest-cli.json /atr/packages/backend/
#COPY /assets /atr/assets/
#COPY .env .root.dir /atr/

#RUN rm -rf /atr/dist

#COPY --from=compiled:0.0.3 . .
COPY --from=compiled /atr/.root.dir /atr/.root.dir
COPY --from=compiled /atr/assets/ /atr/assets/
COPY --from=compiled /atr/packages/backend/dist/apps/ms-cron/ /atr/packages/backend/apps/ms-cron/
COPY --from=compiled /atr/packages/backend/dist/apps/ms-base/ /atr/packages/backend/apps/ms-base/
COPY --from=compiled /atr/packages/backend/dist/apps/ms-ti-base/ /atr/packages/backend/apps/ms-ti-base/
COPY --from=compiled /atr/node_modules /atr/node_modules
COPY --from=compiled /atr/packages/backend/node_modules /atr/packages/backend/node_modules

CMD ["node", "--enable-source-maps", "packages/backend/apps/ms-cron/src/portfolio.js"]

#RUN yarn build:ms:cron
#WORKDIR /atr
#COPY --from=compiled /atr/packages/backend/dist/apps/ms-cron /atr
#ENTRYPOINT ["doppler", "run", "--"]
#CMD ["node", "--enable-source-maps", "main-backend/apps/mdb-internal-service/src/main.js"]
#EXPOSE 80

