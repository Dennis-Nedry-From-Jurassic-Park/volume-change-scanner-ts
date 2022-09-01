const A = [{id:1}, {id:4}, {id:3}, {id:2}]
const B = [{id:0}, {id:2}, {id:1}, {id:2}]
console.log(A.filter(a => !B.map(b=>b.id).includes(a.id)))

//let combined_tickers = all_usa_tickers.filter((it: any) => {
//    return !tickers_10_00_main_session.includes(it)
//});
