import {rangeExclusive} from "./range";

const {sort} = require('fast-sort');

const getWeight = (object: any, value: number) => getKeyByValue(object, value);

function getKeyByValue(object: any, value: number) {
    return Object
        .keys(object)
        .find(key =>
            (value >= Math.min(...object[key]) && value <= Math.max(...object[key]))
        );
}

function getKeysWithHighestValue(o:any, n:number){ // console.log(getKeysWithHighestValue(obj, 10))
    let keys = Object.keys(o);
    keys.sort(function(a,b){ return o[b] - o[a]; });
    console.log(keys);
    return keys.slice(0,n);
}

export const prepareWeights = (indicators: number[]) => {
    let weights = indicators;

    weights.push(0);

    for (let _i = 0; _i < weights.length-1; _i++) {
        const min = weights[_i];
        const max = weights[_i+1];
        const step = (min === 0) ? 0.05 : (max/min) >= 5 ? 100 : 0.05;

        const values = rangeExclusive(min + step, max - step, step);

        values.forEach((value: any) => { weights.push(value); });

        weights = sort(weights).asc();
    }

    let indexSlice = 0;

    let arrArrs = [];
    let precision = 0.000000001;

    for (let _i = 0; _i < weights.length-1; _i++) {
        const cur  = weights[_i];
        const next = weights[_i + 1];

        arrArrs.push([cur, next - precision]);

        indexSlice = _i+1;
    }

    let obj:any = {};

    const totalWeight = 1;
    let currentWeight:number = totalWeight;
    const stepWeight = totalWeight / arrArrs.length;

    for (let _i = 0; _i < arrArrs.length; _i++) {
        const currArr = arrArrs[_i];
        const index = currentWeight;
        obj[index] = currArr;
        currentWeight -= stepWeight;
    }

    console.log(getWeight(obj, 0.05888));
    console.log(getKeyByValue(obj,  0.05888));
    console.log(getKeyByValue(obj, 0.512345));

    const sliced = Object.fromEntries(
        Object.entries(obj).slice(0, 5)
    );
    console.log(sliced);

    return obj;
};