import {v4 as uuidv4} from 'uuid';
//import {IntervalTree} from "interval-tree-type";
//const IntervalTree = require("interval-tree-type");
    var ibst = require("ibst");

//const tree = new IntervalTree();


import { WrrPool } from './wrr.pool';
//import { createIntervalTree } from 'interval-tree-1d';
var createIntervalTree = require("interval-tree-1d")
var StaticIntervalTree = require('mnemonist/static-interval-tree');


const wrrPool = new WrrPool();

const tvalArr = (range: number): any => {
    const tree = new IntervalTree();
    let i = range+1;
    let arr = [];
    const PRECISION = 1e-8;
    let step = 0.005

    while ( --i ){
        tree.insert(i-1, i-PRECISION, step);
        step++;
    }

    return tree;
}

const intervalTreeCr = (range: number): any => { // typeof IntervalTree
    var tree = new IntervalTree(1_000_000)
    let i = range+1;
    let arr = [];
    const PRECISION = 1e-8;
    let step = 0.005

    while ( --i ){
        //intervalTree.insert({min:i-1,max:i-PRECISION,value: step});
        //intervalTree.insert(i-1,i-PRECISION,step);
        intervalTree.insert([i-1,i-PRECISION],step);
        //tree.add(i-1,i-PRECISION,step);
        step++;
    }

   return tree;
}

//const tree = tvalArr(8_000_000);


const valArr = (range: number): any[] => {
    let i = range+1;
    let arr = [];
    const PRECISION = 1e-8;

    while ( --i ){
        arr.push([i-1, i-PRECISION])
    }

    return arr;
}

const weiArr = (range: number): any[] => {
    let i = range+1;
    let arr = [];
    const PRECISION = 1e-8;

    while ( --i ){
        arr.push(i)
    }

    return arr;
}
//const IntervalTree = require('augmented-interval-tree');
//var IntervalTree = require('interval-tree2');
//var itree = intervalTreeCr(1_000_000);

//const intervalTree = new IntervalTree();


const peersValues = valArr(50_000_000);
const peersWeights = weiArr(3);

//var staticIntervalTree = StaticIntervalTree.from(peersValues);
//intervalTreeCr
 //var grades = new ibst();
 //gradesCr(1_000_000);
 //

//var createIntervalTree = require("interval-tree-1d")


var intervals = require('interval-query');

//var tree = new intervals.SegmentTree;


let uuid = uuidv4();

const b = require('benny')

const suiteName = 'wrr-pool'

const options = {
  minSamples: 1,
  delay: 0.0025
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// wrrPool.peers = { // 102 517 408 ops/s - 93 175 217 ops/s
//                 peersValues : peersValues,
//                 peersWeights : peersWeights
//             }

let IntervalTree = require('flatten-interval-tree');
let tree = new IntervalTree();
intervalTreeCr(1_000_000);



b.suite(
  suiteName,

/*

staticIntervalTree : max:
    26 830 452 ops/s, ±3.90%   | fastest

  staticIntervalTree : min:
    1 533 238 ops/s, ±1.13%    | slowest, 94.29% slower
*/

//     b.add('intervalTree : max', () => {
//                  intervalTreeCr(1_000_000);
//                  itree.search(100_000);
//                  //grades.search(50_000_000);
//             }, options),
//     b.add('staticIntervalTree : max', () => {
//                  staticIntervalTree.intervalsContainingPoint(50_000_000);
//             }, options),
//
//     b.add('staticIntervalTree : min', () => {
//                  staticIntervalTree.intervalsContainingPoint(2);
//             }, options),//
   S b.add('staticIntervalTree : min', () => {
                 staticIntervalTree.intervalsContainingPoint(2);
            }, options),

   // b.add('tree', () => {
         //const PRECISION = 1e-8;
        //tree.pushInterval(1, 5);
//                 tree.pushInterval(-1, 1);
//                 tree.pushInterval(1 + PRECISION, 3);
//                 tree.pushInterval(3 + PRECISION, 6);
//         console.log(tree.queryPoint(2));
        //wrrPool.get(rand(0, 25_000_000));
        //tree.queryPoint(rand(0, 8_000_000));
    //    tree.queryPoint(4_000_000);
   // , options), // 463 974 654 ops/s * 2

//     b.add('0.001', () => {
//             wrrPool.get(0.001);
//         }, options),

//     b.add('0.001 (queryPoint)', () => {
//     var tree = createIntervalTree(peersValues)
//     console.log(peersValues)
//     console.log(tree)
//             tree.queryPoint(1);
//         }, options),

//     b.add('5_000_000', () => {
//             wrrPool.get(5_000_000 - 1);
//         }, options),

//     b.add('1_000_000 (queryPoint)', () => {
//     var tree = createIntervalTree(peersValues)
//             tree.queryPoint(99_999.0);
//         }, options),

    /*b.add('29_999', () => {
            wrrPool.get(4_999_999);
        }, options),
    b.add('49_999', () => {
            wrrPool.get(4_999_999);
        }, options),
    b.add('99_999', () => {
            wrrPool.get(4_999_999);
        }, options),
    b.add('199_999', () => {
            wrrPool.get(4_999_999);
        }, options),
    b.add('299_999', () => {
            wrrPool.get(4_999_999);
        }, options),
    b.add('399_999', () => {
            wrrPool.get(4_999_999);
        }, options),
    b.add('699_999', () => {
            wrrPool.get(4_999_999);
        }, options),
    b.add('999_999', () => {
            wrrPool.get(4_999_999);
        }, options),
    b.add('2_999_999', () => {
            wrrPool.get(4_999_999);
        }, options),
    b.add('4_999_999', () => {
            wrrPool.get(4_999_999);
        }, options),
    b.add('8_999_999', () => {
            wrrPool.get(8_999_999);
        }, options),
    b.add('12_999_999', () => {
            wrrPool.get(12_999_999);
        }, options),
    b.add('16_999_999', () => {
            wrrPool.get(16_999_999);
        }, options),
    b.add('20_999_999', () => {
            wrrPool.get(20_999_999);
        }, options),*/


    b.cycle(),
    b.complete(),

    b.save({ file: suiteName+uuid, version: '1.0.0' }),
    b.save({ file: suiteName+uuid, format: 'chart.html' }),
)