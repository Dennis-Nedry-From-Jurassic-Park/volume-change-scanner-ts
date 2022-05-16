import {roaPool} from '../pools/efficiency.pool';

import {v4 as uuidv4} from 'uuid';

let uuid = uuidv4();

const b = require('benny')

const suiteName = 'tree_vs_wrr_pool'
var Integer = require('integer');

//const IntervalTree = require("interval-tree-type");

const createIntervalTree = (range: typeof Integer): typeof IntervalTree => {
    const tree = new IntervalTree();
    let i = Integer(range + 1);
    const PRECISION = 1e-8;
    let weight = 0.005;

    while ( --i ){
        tree.insert(i-1, i-PRECISION, weight);
        weight++;
    }

    return tree;
}

const tree = createIntervalTree(Integer(1_000_000));

const cr_ibst = (range: number): any[] => {
    let i = range+1;
    let arr = [];
    const PRECISION = 1e-8;
    let weight = 0.005;

    while ( --i ){
        arr.push({min:i-1,max:i-PRECISION,value:weight})
        weight++;
    }

    return arr;
}

// const cr_itree = (range: number): any => {
//     var itree = new IntervalTree2(range)
//     let i = range+1;
//     const PRECISION = 1e-8;
//     let weight = 0.005;
//
//     while ( --i ){
//         itree.add([i-1, i-PRECISION,  weight]);
//         weight++;
//     }
//
//     return itree;
// }



//var IntervalTree2 = require('interval-tree');
//var itree = cr_itree(50_000);
//var ibst = require("ibst");

//var ibst_tree = new ibst(cr_ibst(10_000));

const options = {
  minSamples: 1,
  delay: 0.005
}

b.suite(
  'Example',

//   b.add('itree', () => {
//       itree.search(50_000.0);
//     }, options),

  b.add('tree', () => {
      tree.queryPoint(500_000.0);
    }, options),
//
//   b.add('ibst_tree', () => {
//       ibst_tree.search(5_000.0);
//     }, options),

//   b.add('wrr poll', () => {
//     roaPool.getROAWeight(999.99);
//     }, options),

  b.cycle(),
  b.complete(),

  b.save({ file: suiteName + uuid, version: '1.0.0' }),
  b.save({ file: suiteName + uuid, format: 'chart.html' }),
)