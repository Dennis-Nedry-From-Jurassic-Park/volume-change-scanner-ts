import { AVLTree } from "@foxglove/avl";

//const tree = new AVLTree<number, string>();



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

    for(let i:number = 1; i <= 20; i++) {
            obj.weights.push(i)
            obj.name.push('111')
            obj.blocked.push(false)
        }

        return obj;
}

function cycleX(array: any[]): any {
    let length = array.length;
    let max = array[0];
    let index = length;

    while( --length ) {
        const curr = array[length];
        if(curr > max){
            max = curr;
            index = length;
        }
    }

    return {max, index};
}
function cycleY(array: any[]): any {
    let length = array.length;
    let index = 0;
    let max = -Infinity;

    while( --length ) {
        if(array[length] > max){
            max = array[length];
            index = length;
        }
    }

    return index;
}



const weiArr = (): any[] => {
    let i = 3+1;
    let arr = [];
    const PRECISION = 1e-8;

    while ( --i ){
        arr.push([i-1, i-PRECISION])
    }

    return arr;
}

var createIntervalTree = require("interval-tree-1d")


var intervals = require('interval-query');

var sequ = new intervals.Sequential;


const tree_check = () => {
    var tree = new intervals.SegmentTree;

    tree.pushInterval(1, 5);
    tree.pushInterval(2, 7);
    tree.pushInterval(3, 6);
    tree.buildTree();
    console.log(tree.queryOverlap());
}


const check = () => {
    const o = createO();
    console.log(o)

    const index = cycleY(o.weights);
            const o2 = {
                'name': o.name[index],
                'weight': o.weights[index],
                'blocked': o.blocked[index]
            }
     console.log(o2)

     console.log(weiArr())

     //Create some random list of intervals
     var intervals = [ [1, 2], [-1, 0], [0.5, 1], [-10, 10] ]

     //Build tree
     var tree = createIntervalTree(intervals)

     //Find all intervals containing query point 0.7
     console.log("querying point:", 0.7)
     tree.queryPoint(0.7, function(interval:any) {
       console.log(interval)
     })

     const PRECISION = 1e-8;
             //tree.pushInterval(1, 5);
                     sequ.pushInterval(-1, 1);
                     sequ.pushInterval(1 + PRECISION, 3);
                     sequ.pushInterval(3 + PRECISION, 9);

                     const p = sequ.queryPoint(2)
             console.log(p);
}

tree_check();