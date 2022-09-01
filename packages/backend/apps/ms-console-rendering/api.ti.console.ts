let Table = require('cli-table');

// instantiate
let table = new Table({
    head: ['TH 1 label', 'TH 2 label']
    , colWidths: [10, 10]
});

// table is an Array, so you can `push`, `unshift`, `splice` and friends
table.push(
    ['First value', 'First value']
    , ['Second value', 'Second value']
);

const cycle = (iterator:number, rows: any) => {
    //tableCli.render();
    iterator++;
    table.push(
        [iterator+' value', iterator+' value']
    );
    console.log(table.toString());
    //table =
    setTimeout(() => {
        cycle(iterator, rows)
    }, 500)
}

cycle(1, null)





// const header = ["SYMBOL", "LAST"]
// const baseline = {
//     aapl: 92,
//     ibm: 120.72,
//     wmt: 68.93,
//     abx: 13.36,
//     msft: 35.26
// }
//
// setInterval(function () {
//     //  //Add imaginary ticker
//      let newTicker = Math.random().toString(36).substring(7);
//      baseline[newTicker] = Math.random();
//
//      //Remove a random ticker
//      let keys = Object.keys(baseline);
//      let random =   Math.floor(Math.random() * keys.length) + 0;
//      delete baseline[keys[random]];
//
//     const array = [header]
//
//     for (const i in baseline) {
//         // give each symbol a 30% chance of changing
//         if (Math.random() >= 0.7) {
//             baseline[i] = (baseline[i] + ((Math.random() > 0.5) ? 0.01 : -0.01)).toFixed(2) * 1
//         }
//         array.push([i, `$ ${baseline[i].toFixed(2)}`])
//     }
//
//     const string = JSON.stringify(array)
//     console.log(string)
// }, 500)
//
// process.stdout.on("error", function () {
//     process.exit(1)
// })
//
//
//
// // let TableCli = require('tty-table')
// //
// //
// // //var TableCli = require('tty-table/automattic-cli-table');
// //
// // /* col widths */
// // var tableCli = new TableCli({
// //     head: ['Rel', 'Change', 'By', 'When']
// //     , colWidths: [6, 21, 25, 17]
// // });
// // tableCli.push(
// //     ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '7 minutes ago']
// //     , ['v0.1', 'Testing something cool', 'rauchg@gmail.com', '8 minutes ago']
// // );
// // console.log(tableCli.toString());
// //
// // const cycle = (iterator:number, rows: any) => {
// //     //tableCli.render();
// //     iterator++;
// //     tableCli.push(
// //         ['v0.'+iterator, 'Testing something cool '+iterator, 'rauchg@gmail.com', '7 minutes ago']
// //     );
// //     console.log(tableCli.toString())
// //
// //     setTimeout(() => {
// //         cycle(iterator, rows)
// //     }, 500)
// // }
// //
// // cycle(2, null)
// //
// //
// //
// //
// // /*
// //
// //
// //
// // let header = [
// //     {
// //         value: "SYMBOL",
// //         headerColor: "cyan",
// //         color: "white",
// //         align: "left",
// //         width: 10
// //     },
// //     {
// //         value: "LAST",
// //         color: "red",
// //         width: 10,
// //         formatter: function (value:number) {
// //             let str = `$${value.toFixed(2)}`
// //             return (value > 5) ? this.style(str, "green", "bold") :
// //                 this.style(str, "red", "underline")
// //         }
// //     }
// // ]
// //
// // const options = {
// //     borderStyle: "solid",
// //     borderColor: "blue",
// //     headerAlign: "center",
// //     align: "left",
// //     color: "white",
// //     truncate: "...",
// //     width: "90%"
// // }
// //
// // let rows = [
// //     {
// //         SYMBOL: "AAPL",
// //         LAST: 112.5099
// //     },
// //     {
// //         SYMBOL: "TSN",
// //         LAST: 87.50
// //     }
// // ]
// //
// // let out = Table(header,rows,options);
// //
// // let tickers = [
// //     ["AAPL", 138],
// //     ["IBM", 120],
// //     ["WMT", 68],
// //     ["ABX", 13],
// //     ["MSFT", 35]
// // ]
// // out.render();
// // const cycle = (iterator:number, rows: any) => {
// //     out = Table(header,rows,options);
// //     // tickers = tickers.map((value:any) => {
// //     //     const sign:number = (Math.random()) < 0.5 ? -1 : 1
// //     //     const increment:number = Math.random()!
// //     //     const newVal = (value[1]! + sign * increment).toFixed(2) * 1
// //     //     return [value[0], newVal]
// //     // })
// //
// //     //console.log(JSON.stringify(tickers))
// //     //console.log(out)
// //     out.push({
// //         SYMBOL: "AAPL", LAST: 112.5099 + iterator
// //     })
// //     out.render();
// //     //console.log(out)
// //     //out.push(["AAPL", 112.5099 + iterator]);
// //
// //     iterator++
// //
// //     setTimeout(() => {
// //         cycle(iterator, rows)
// //     }, 5000)
// // }
// //
// // process.stdout.on("error", () => {
// //     process.exit(1)
// // })
// //
// // cycle(2, rows)
// //
// // */