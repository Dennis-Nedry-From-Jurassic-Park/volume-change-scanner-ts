CREATE TABLE IF NOT EXISTS instruments.TradingShedules
    (
        exchange LowCardinality(String),
        date DateTime NULL,
        isTradingDay Bool,
        startTime DateTime NULL,
        endTime DateTime NULL,
        openingAuctionStartTime DateTime NULL,
        closingAuctionEndTime DateTime NULL,
        eveningOpeningAuctionStartTime DateTime NULL,
        eveningStartTime DateTime NULL,
        eveningEndTime DateTime NULL,
        clearingStartTime DateTime NULL,
        clearingEndTime DateTime NULL,
        premarketStartTime DateTime NULL,
        premarketEndTime DateTime NULL
) ENGINE = MergeTree() ORDER BY tuple();



CREATE TABLE IF NOT EXISTS instruments.TradingShedules
    (
        exchange LowCardinality(String),
        date DateTime NULL,
        isTradingDay Bool,
        startTime DateTime NULL,
        endTime DateTime NULL,
        openingAuctionStartTime DateTime NULL,
        closingAuctionEndTime DateTime NULL,
        eveningOpeningAuctionStartTime DateTime NULL,
        eveningStartTime DateTime NULL,
        eveningEndTime DateTime NULL,
        clearingStartTime DateTime NULL,
        clearingEndTime DateTime NULL,
        premarketStartTime DateTime NULL,
        premarketEndTime DateTime NULL
) ENGINE = MergeTree() ORDER BY tuple();