import {roaPool} from '../pools/efficiency.pool';

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

  b.add('warm', () => {
    isEnabled: () => true;
  }, options),

  b.add('getROAWeight', () => {
      roaPool.getROAWeight(999.99);
    }, options),

  b.add('getROAWeight0', () => {
    roaPool.getROAWeight0(999.99);
    }, options),

  b.cycle(),
  b.complete(),

  b.save({ file: 'getROAWeight_'+uuid, version: '1.0.0' }),
  b.save({ file: 'getROAWeight_'+uuid, format: 'chart.html' }),
)