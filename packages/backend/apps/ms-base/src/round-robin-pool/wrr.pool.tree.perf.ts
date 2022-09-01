import {v4 as uuidv4} from 'uuid';

//import { BitFieldMixin } from "structurae";
//const Field = BitFieldMixin({ left: 24, right: 24, w: 64 });







// class Tree extends BitField {}
// Tree.fields = valArr(5);
// Word.initialize();
//
// const search = (num: number): any  => {
//     if()
//
// }

var Integer = require('integer');


const IntervalTree = require("interval-tree-type");

var BinarySearchTree = require('@rmanibus/binary-search-tree').BinarySearchTree
  , AVLTree = require('@rmanibus/binary-search-tree').AVLTree

let uuid = uuidv4();

const b = require('benny')

const suiteName = 'tree'

const options = {
  minSamples: 2500,
  delay: 0.0025
}

const createIntervalTree = (range: number): typeof IntervalTree => {
    const tree = new IntervalTree();
    let i = range + 1;
    const PRECISION = 1e-8;
    let step = 0.005;

    while ( --i ){
        tree.insert(i-1, i-PRECISION, step);
        step++;
    }

    return tree;
}

const createIntervalTreeInt = (range: typeof Integer): typeof IntervalTree => {
    const tree = new IntervalTree();
    let i = Integer(range + 1);
    const PRECISION = 1e-8;
    let step = 0.005;

    while ( --i ){
        tree.insert(i-1, i, step);
        step++;
    }

    return tree;
}

function compareKeys (a:any, b:any) {
  if ((a.left < b.left) || (a.right > b.right)) { return -1; }
  if (a.left > b.left || a.right < b.right) { return 1; }

  return 0;
}

const createAVLTree = (range: number): typeof AVLTree => {
    const avl = new AVLTree({ compareKeys: compareKeys });
    let i = range + 1;
    const PRECISION = 1e-8;
    let step = 0.005

    while ( --i ){
        avl.insert({ left: i-1, right: i-PRECISION }, step);
        step++;
    }

    return avl;
}

const createBstTree = (range: number): typeof BinarySearchTree => {
    const bst = new BinarySearchTree({ compareKeys: compareKeys });
    let i = range + 1;
    const PRECISION = 1e-8;
    let step = 0.005

    while ( --i ){
        bst.insert({ left: i-1, right: i-PRECISION }, step);
        step++;
    }

    return bst;
}

//var bst = createBstTree(1000);

const tree = createIntervalTreeInt(Integer(10_000_000));
//createIntervalTree(1);

// const createFields = (range: typeof Integer): any => {
//     const field = new Field();
//     let i = Integer(range + 1);
//     let arr = [];
//     const PRECISION = 1e-8;
//     let step = 0.005;
//
//     while ( --i ){
//         field.set("left", i-1);
//         field.set("right", i);
//         field.set("w", step);
//         arr.push(field)
//         step++;
//     }
//
//     return arr;
// }

//const fields = createFields(10);

// const searchBit = (arr: any[], num: number): any => {
//     for(const elem of arr){
//         if (elem.get("left") > num ) continue;
//
//         if (elem.get("right") >= num) {
//             return elem;
//         }
//     }
//     return null;
// }

b.suite(
  suiteName,

//   b.add('bst', () => {
//         bst.search(1);
//   }, options),

//   b.add('fields', () => {
//         searchBit(fields, 2);
//   }, options),
  b.add('IntervalTreeInt', () => {
        tree.queryPoint(5_500_000);
  }, options),

//   b.add('tree queryPoint mid point', () => {
//         tree.queryPoint(4_500_000);
//   }, options),
//
//   b.add('tree queryAfterPoint mid point', () => {
//         for(let interval of tree.queryAfterPoint(4_500_000 - 1)){
//             if(interval.low <= 4_500_000 && interval.high >= 4_500_000) console.log("find")
//         }
//   }, options),

  b.cycle(),
  b.complete(),

  b.save({ file: suiteName+uuid, version: '1.0.0' }),
  b.save({ file: suiteName+uuid, format: 'chart.html' }),
)





