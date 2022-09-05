// import util from "util";
//
// const parser = require('block-parser')({ pairs: "{}" });
//
// const sample = `
// message Share {
//   string figi = 1; //Figi-идентификатор инструмента.
//   string ticker = 2;  //Тикер инструмента.
//   string class_code = 3; //Класс-код (секция торгов).
//   string isin = 4; //Isin-идентификатор инструмента.
//   int32 lot = 5; //Лотность инструмента. Возможно совершение операций только на количества ценной бумаги, кратные параметру *lot*. Подробнее: [лот](https://tinkoff.github.io/investAPI/glossary#lot)
//   string currency = 6; //Валюта расчётов.
//
//   Quotation klong = 7; //Коэффициент ставки риска длинной позиции по инструменту.
//   Quotation kshort = 8; //Коэффициент ставки риска короткой позиции по инструменту.
//   Quotation dlong = 9; //Ставка риска минимальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/)
//   Quotation dshort = 10; //Ставка риска минимальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/)
//   Quotation dlong_min = 11; //Ставка риска начальной маржи в лонг. Подробнее: [ставка риска в лонг](https://help.tinkoff.ru/margin-trade/long/risk-rate/)
//   Quotation dshort_min = 12; //Ставка риска начальной маржи в шорт. Подробнее: [ставка риска в шорт](https://help.tinkoff.ru/margin-trade/short/risk-rate/)
//   bool short_enabled_flag = 13; //Признак доступности для операций в шорт.
//   string name = 15; //Название инструмента.
//   string exchange = 16; //Торговая площадка.
//
//   google.protobuf.Timestamp  ipo_date = 17; //Дата IPO акции в часовом поясе UTC.
//   int64 issue_size = 18; //Размер выпуска.
//
//   string country_of_risk = 19; //Код страны риска, т.е. страны, в которой компания ведёт основной бизнес.
//   string country_of_risk_name = 20; //Наименование страны риска, т.е. страны, в которой компания ведёт основной бизнес.
//   string sector = 21; //Сектор экономики.
//   int64 issue_size_plan = 22; //Плановый размер выпуска.
//   MoneyValue nominal = 23; //Номинал.
//
//   SecurityTradingStatus trading_status = 25; //Текущий режим торгов инструмента.
//   bool otc_flag = 26; //Признак внебиржевой ценной бумаги.
//   bool buy_available_flag = 27; //Признак доступности для покупки.
//   bool sell_available_flag = 28; //Признак доступности для продажи.
//   bool div_yield_flag = 29; //Признак наличия дивидендной доходности.
//   ShareType share_type = 30; //Тип акции. Возможные значения: [ShareType](https://tinkoff.github.io/investAPI/instruments#sharetype)
//   Quotation min_price_increment = 31; //Шаг цены.
//   bool api_trade_available_flag = 32; //Признак доступности торгов через API.
//
//   string uid = 33; //Уникальный идентификатор инструмента.
//   RealExchange real_exchange = 34; //Реальная площадка исполнения расчётов.
//   string position_uid = 35; //Уникальный идентификатор позиции инструмента.
//
//   bool for_iis_flag = 46; //Признак доступности для ИИС.
//
//   google.protobuf.Timestamp first_1min_candle_date = 56; //Дата первой минутной свечи.
//   google.protobuf.Timestamp first_1day_candle_date = 57; //Дата первой дневной свечи.
// }
// `
//
// console.log(
//     util.inspect(
//         parser.get(sample),
//         { colors: true }));