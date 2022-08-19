const stocks = require('yahoo-nasdaq');

stocks.getquote(["AMZN","ADBE"])
    .then((json) => console.log(json))
    .catch((err) => console.error(err));