import {max,maxSort,cycle,cycleX,cycleY} from './max.by';
import { maxBy } from 'lodash';
//import {arrSort} from '@bemoje/arr-sort'
const {
  quickSort,
  mergeSort
} = require('sort-algorithms-js');

import { sortBy } from 'sort-by-typescript';


import {v4 as uuidv4} from 'uuid';

let uuid = uuidv4();

const b = require('benny')

/*
 cycle:
    355.5 ops/s, ±1.45%   | fastest

  _.maxBy:
    53.1 ops/s, ±0.17%    | slowest, 85.06% slower

  max:
    127.3 ops/s, ±0.17%   | 64.19% slower

  maxSort:
    126.8 ops/s, ±0.31%   | 64.33% slower

*/

const options = {
  minSamples: 1000,
  delay: 0.005
}

var TimSort = require('timsort');


type o = {
    weights: number[],
    name: string[],
    blocked: boolean[]
}

function createO(): any {
    let obj: o =  {
                      weights: [],
                      name: [],
                      blocked: []
                  }

    for(let i:number = 1; i <= 5_000_000; i++) {
            obj.weights.push(i)
            obj.name.push('111-' + i)
            obj.blocked.push(false)
        }

        return obj;
}


function createObj(): any[] {
    let arr = [];
    for(let i:number = 1; i <= 5_000_000; i++) {
        arr.push({ 'name': '111', 'age': i, 'blocked': false })
    }
    return arr;
}

const objX = createO();
const objY = createO();
//const obj = createObj();
//let arr = obj;
//let arr2 = obj;

b.suite(
  'lodash maxBy vs own implementation',

//    b.add('cycle', () => {
//           cycle(obj);
//       }, options),

//   b.add('_.maxBy', () => {
//         maxBy(obj, 'age');
//     }, options),

  b.add('_.maxByDoD', () => {
        const {max, index} = cycleX(objX.weights);
        const o = {
            'name': objX.name[index],
            'weight': max,
            'blocked': objX.blocked[index]
        }
    }, options),

  b.add('_.maxByDoD-Y', () => {
        const index = cycleY(objY.weights);
        const o = {
            'name': objY.name[index],
            'weight': objY.weights[index],
            'blocked': objY.blocked[index]
        }
    }, options),

//   b.add('max', () => {
//         max(obj);
//     }, options),

//   b.add('timsort', () => {
//         TimSort.sort(arr);
//         arr[0];
//     }, options),

//   b.add('arrSort', () => {
//         arrSort(arr, {
//           by: 'age',
//         })
//         arr[0];
//     }, options),

//   b.add('mergeSort', () => {
//           mergeSort(arr, (a:any, b:any) => a.age - b.age);
//       }, options),
//
//   b.add('sortBy', () => {
//           arr2.sort(sortBy('-age'));
//       }, options),

//   b.add('quickSort', () => {
//         quickSort(arr2, (a:any, b:any) => b.age - a.age);
//     }, options),

//   b.add('maxSort', () => {
//         maxSort(obj);
//     }, options),

//   b.add('fiMax', () => {
//         fiMax(obj);
//     }, options),

  b.cycle(),
  b.complete(),

  b.save({ file: 'maxBy'+uuid, version: '1.0.0' }),
  b.save({ file: 'maxBy'+uuid, format: 'chart.html' }),
)