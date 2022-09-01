https://github.com/stefanprodan/dockprom
https://www.bogotobogo.com/DevOps/Docker/Docker_Prometheus_Grafana.php

https://github.com/siimon/prom-client#prometheus-client-for-nodejs--
https://github.com/PayU/prometheus-api-metrics

https://grafana.com/grafana/dashboards/11159-nodejs-application-dashboard/
https://grafana.com/grafana/plugins/vertamedia-clickhouse-datasource/

https://prometheus.io/docs/practices/naming/

https://grafana.com/grafana/dashboards/2515-clickhouse-queries/
https://altinity.com/blog/2019/12/28/creating-beautiful-grafana-dashboards-on-clickhouse-a-tutorial

https://github.com/siimon/prom-client#configuration

https://qna.habr.com/q/246858

https://qna.habr.com/q/866001
https://github.com/byumov/tinkoff_investing_exporter
https://github.com/Anrikigai/promTinkoff/blob/master/promTinkoff.ipynb
https://habr.com/ru/post/578852/
https://github.com/Anrikigai/promTinkoff
https://github.com/topics/prometheus?l=typescript
https://github.com/marcel-dempers/docker-development-youtube-series/blob/master/monitoring/prometheus/nodejs-application/src/server.js
https://github.com/siimon/prom-client#default-labels-segmented-by-registry
https://github.com/RisingStack/example-prometheus-nodejs

https://npmtrends.com/@willsoto/nestjs-prometheus-vs-prometheus-api-metrics

Вам нужно установить на хост node_exporter (можно в докере).
Он будет собирать метрики с хоста и экспортировать их для prometheus.


So in v8.1 we are adding two new transforms that will allow you to extract config like min, max, unit and thresholds from a normal query:

Config from query results
Rows to fields

We are soon switching to Github discussions for feature requests,
will create an issue there next week to collect feedback on these new transforms

https://github.com/grafana/grafana/issues/4929
https://grafana.com/docs/grafana/next/panels/transformations/config-from-query/
multiple gauge grafana
https://github.com/gipong/grafana-groupedbarchart-panel

static_configs:
- targets: ['localhost:9090']

https://github.com/pragmaticivan/nestjs-otel-prom-grafana-tempo
https://habr.com/ru/post/492742/
https://www.reddit.com/r/glpi/comments/w1v70x/just_showing_off_this_is_our_grafana_helpdesk/
https://www.reddit.com/t/grafana/
https://grafana.com/solutions/
https://www.homelabrat.com/category/dashboards/page/2/
https://github.com/TehloWasTaken/HomeDashboardv3
https://github.com/pragmaticivan/nestjs-otel
https://opentelemetry.io/docs/concepts/
https://opentelemetry.io/docs/concepts/instrumenting/
https://github.com/pragmaticivan/nestjs-otel-prom-grafana-tempo-otel-collector
https://www.youtube.com/watch?v=-yCtBUtTD9o
https://github.com/PayU/prometheus-api-metrics
https://github.com/prometheus/node_exporter
https://www.spektor.dev/introduction-to-prometheus-and-grafana/
https://github.com/yossisp/prometheus-grafana-tutorial
https://blog.ziggornif.xyz/post/nodejs-api-monitoring/
https://blog.ziggornif.xyz/post/nodejs-api-monitoring/#bonus--monitoring-nodejs-metrics
https://github.com/yossisp/prometheus-grafana-tutorial/blob/main/docker-compose.yml
https://www.spektor.dev/introduction-to-prometheus-and-grafana/
https://blog.risingstack.com/node-js-performance-monitoring-with-prometheus/
https://dev.to/austincunningham/get-prometheus-metrics-from-a-express-js-app-53ck
https://logz.io/blog/nestjs-javascript-opentelemetry-auto-instrumentation/#step_2
https://github.com/PayU/prometheus-api-metrics
