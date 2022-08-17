import {gcd_1, gcd_2, gcd_3, gcd_4} from './pool';

import {v4 as uuidv4} from 'uuid';

let uuid = uuidv4();

const b = require('benny')
const num = 31;

const options = {
  minSamples: 1000,
  delay: 0.0025
}

/*

Progress: 100%

  gcd_1:
    125 314 537 ops/s, ±0.33%   | 0.97% slower

  gcd_2:
    126 542 222 ops/s, ±0.28%   | fa stest

  gcd_3:
    42 031 066 ops/s, ±120.92%    | slowest, 66.78% slower

Finished 3 cases!
  Fastest: gcd_2
  Slowest: gcd_3


*/

b.suite(
  'Example',

  b.add('gcd_1', () => {
        gcd_1( 48, 18 );
    }, options),

//   b.add('gcd_2', () => {
//         gcd_2( 48, 18 );
//     }, options),
//
//   b.add('gcd_3', () => {
//         gcd_3( 48, 18 );
//     }, options),

  b.add('gcd_4', () => {
        gcd_4( 48, 18 );
    }, options),

  b.cycle(),
  b.complete(),

  b.save({ file: 'gcd'+uuid, version: '1.0.0' }),
  b.save({ file: 'gcd'+uuid, format: 'chart.html' }),
)