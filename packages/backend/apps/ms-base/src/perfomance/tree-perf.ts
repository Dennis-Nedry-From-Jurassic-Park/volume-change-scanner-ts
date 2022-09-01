// import {v4 as uuidv4} from 'uuid';
//
// import {ArrayTree, BTree} from "tiny-tree"
//
// let uuid = uuidv4();
//
// const b = require('benny')
//
// const dataTree = require('data-tree')
//
//
// var Integer = require('integer');
//
// var randomstring = require("randomstring");
//
//
// const fill_tree = (range: typeof Integer): typeof dataTree => {
//     const sectors = [
//         '#IT', '#consumer', '#industrials', '#utilities', '#energy', '#financial', '#materials', '#health_care', '#real_estate', '#telecom'
//     ] // TODO: как числа
//
//     var tree = dataTree.create();
//
//     sectors.forEach( (sector:string) => {
//         for(let n = 1; n <= range; n++){
//             tree.insert({
//                 key: sector,
//                 value: {
//                      name: 'BBG004MN1R00' + n,
//                      color: randomstring.generate(4)
//                 }
//               });
//         }
//     })
//
//
//     return tree;
// }
//
// var tree = fill_tree(200);
//
// const tiny_tree = new BTree({degree: 17});
//
//
// const options = {
//   minSamples: 5,
//   delay: 0.0025
// }
//
// const suiteName = 'interval-tree'
//
// b.suite(
//   suiteName,
//
//   b.add('searchBFS', () => {
//     var node = tree.traverser().searchBFS(function(tree:any){
//         return tree.key === '#materials';
//       });
//     }, options),
//
// //   b.add('searchBFS', () => {
// //     var node = tree.traverser().searchBFS(function(tree:any){
// //         return tree.key === '#materials';
// //       });
// //     }, options),
//
// //   b.add('searchDFS', () => {
// //     var node = tree.traverser().searchDFS(function(tree:any){
// //         return tree.key === '#materials';
// //       });
// //     }, options),
//
//   b.cycle(),
//   b.complete(),
//
//   b.save({ file: suiteName + uuid, version: '1.0.0' }),
//   b.save({ file: suiteName + uuid, format: 'chart.html' }),
// )