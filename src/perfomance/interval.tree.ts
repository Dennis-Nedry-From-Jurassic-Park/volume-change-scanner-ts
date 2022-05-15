import {v4 as uuidv4} from 'uuid';

let uuid = uuidv4();

const b = require('benny')

var Integer = require('integer');
var IntervalTree = require("interval-tree-type");

const createIntervalTree = (range: typeof Integer): typeof IntervalTree => {
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

const numberElements = 1_000_000;
const searchElement = numberElements / 2;

const tree = createIntervalTree(Integer(numberElements));

const AugmentedIntervalTree = require('augmented-interval-tree');


const create_a_tree = (): typeof AugmentedIntervalTree => {
    const temp_tree = new AugmentedIntervalTree();
    let i = 1_000_000;
    let step = 0.005;
    while ( --i ){
            temp_tree.insert(i-1, i, step);
            step++;
        }
        return temp_tree;

}

const a_tree = create_a_tree();

const options = {
  minSamples: 5,
  delay: 0.0025
}

const suiteName = 'interval-tree'

b.suite(
  suiteName,

  b.add('IntervalTree', () => {
          tree.queryPoint(searchElement);
    }, options),

  b.add('a_tree', () => {
          a_tree.find(searchElement);
    }, options),

  b.cycle(),
  b.complete(),

  b.save({ file: suiteName + uuid, version: '1.0.0' }),
  b.save({ file: suiteName + uuid, format: 'chart.html' }),
)