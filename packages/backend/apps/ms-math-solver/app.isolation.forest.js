// import { IsolationForest } from 'isolation-forest'
//
// var isolationForest = new IsolationForest();
// var trainingData = [{ x: 8},{ x: 150},{ x: 200},{ x: 200000},{ x: 800000},{ x: 400000},{ x: 4000000}]
//
// isolationForest.fit(trainingData) // Type ObjectArray ({}[]);
//
// var trainingScores = isolationForest.scores()
// console.log(trainingScores)
// var data = [{ x: 200000},{ x: 800000},{ x: 400000},{ x: 900000},{ x: 8000000}]
// // then predict any data
// var scores = isolationForest.predict(data)
// console.log(scores)




import {IsolationForest} from 'ml-isolation-forest';
let X = [
    [150, 1],
    [200, 1],
    [1, 1],
    [8, 1],
    [1600, 1],
    [800000, 1],
    [900000, 1],
    [500000, 1],
    [200000, 1],
    [100000, 1],
    [8000000, 1],
    [1000000, 1],
];
let anomalyDetector = new IsolationForest();
anomalyDetector.train(X);
let result = anomalyDetector.predict([
    [8, 1],
    [150, 1],
    [200, 1],
    [100000, 1],
    [200000, 1],
    [800000, 1],
    [1000000, 1],
]);
console.log(result);




const arr = [1,2,4,8,81,150,200,1600,40000, 300000,400000,500000,50000000]
    //.filter(([x]) => !isNaN(parseInt(x)))
    //.map(([, key]) => MyEnum[key])
    .reduce((r, val, i, a) => {
        if (!i || val  >  a[i - 1] * 10 ) r.push([]);
        r[r.length - 1].push(val);
        return r;
    }, []);

console.log(arr)

const arr2 = [1,2,4,8,81,150,200,1600,40000, 300000,400000,500000,50000000]

function round(value, precision) {
    if (Number.isInteger(precision)) {
        var shift = Math.pow(10, precision);
        return Math.round(value * shift) / shift;
    } else {
        return Math.round(value);
    }
}

let gap_arrs = [];
let gap_arrs_ids = [];
let max_gap = 1
for(let i=0;i<arr2.length;i++) {
    let prev = arr2[i]
    let curr = arr2[i+1]
    if( curr/prev > max_gap ){
        max_gap = round(curr/prev, 2);
        gap_arrs.push(max_gap)
        gap_arrs_ids.push(i)
    }
}

console.log(gap_arrs)
gap_arrs_ids.shift()
console.log(gap_arrs_ids)

const chunks = arr2.reduceRight((result, value, index) => {
    result[0] = result[0] || [];

    if (gap_arrs_ids.includes(index)) {
        result.unshift([value]);
    } else {
        result[0].unshift(value);
    }

    return result;
}, []);

console.log(chunks);

console.log(gap_arrs)