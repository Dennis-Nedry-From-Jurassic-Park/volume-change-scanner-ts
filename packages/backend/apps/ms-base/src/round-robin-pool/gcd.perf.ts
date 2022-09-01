import {gcd, gcd_rec, gcd_full, gcd_r} from './pool';

import {v4 as uuidv4} from 'uuid';

let uuid = uuidv4();

const b = require('benny')
const num = 31;

const options = {
  minSamples: 1000,
  delay: 0.0025
}

b.suite(
  'Example',

  b.add('gcd', () => {
        gcd( 48, 18 );
    }, options),

  b.add('gcd_rec', () => {
        gcd_rec( 48, 18 );
    }, options),

  b.add('gcd_r', () => {
        gcd_r( 48, 18 );
    }, options),

  b.add('gcd_full', () => {
        gcd_full( 48, 18 );
    }, options),

  b.cycle(),
  b.complete(),

  b.save({ file: 'gcd'+uuid, version: '1.0.0' }),
  b.save({ file: 'gcd'+uuid, format: 'chart.html' }),
)