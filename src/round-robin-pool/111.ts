import { SegmentTree } from  'structures-wiz';

import RBush from 'rbush';

const generate = (range: number): any => {
    const tree = new RBush();
    let i = range+1;
    let arr: any[] = [];
    const PRECISION = 1e-8;
    let step = 0.005

    while ( --i ){
        arr.push({left: i-1, right: i-PRECISION, w: step});
        step++;
        if(i % 5_000_000 === 0){
            tree.load(arr);
            arr = [];
        }
    }
    //tree.load(arr);


    return tree;
}

const tree = generate(40_000_000);

const segTree = new SegmentTree([5,2,1,3,4,6,7,9,8,3]);

//Parameters are lower and upper bound index
console.log("Sum from 0th index to 2nd index:",segTree.getRangeSum(0, 2))


