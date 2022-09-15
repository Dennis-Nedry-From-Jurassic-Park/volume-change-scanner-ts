WORKDIR /atr

COPY --from=compiled /mdb/packages/main-backend/dist/apps/mdb-internal-service /mdb

ENTRYPOINT ["doppler", "run", "--"]
CMD ["node", "--enable-source-maps", "main-backend/apps/mdb-internal-service/src/main.js"]

EXPOSE 80
