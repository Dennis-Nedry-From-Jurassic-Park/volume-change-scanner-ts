//const makeSelect = (comparator) => (a, b) => comparator(a, b) ? a : b;
//maxByValue = (a,b) = makeSelect((a, b) => a.value >= b.value)


function cycle(array: any[]): any {
    let length = array.length;
    let max = array[0];

    while( --length ) {
        const curr = array[length];
        if(curr.age > max.age){
            max = curr;
        }
    }

    return max;
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
    let index = length;

    while( --length ) {
        if(array[length] > array[length-1]){
            index = length;
        }
    }

    return index;
}


// function fiMax(array: any[]): number {
//     return array.find(a => a.age === Math.max(...array.map(e => e.age)));
// }


function max(array: any[]): any {
    return array.reduce((prev, current) => (+prev.age > +current.age) ? prev : current)
}
function maxSort(array: any[]): any {
    //return array.reduce((prev, current) => (+prev.age > +current.age) ? prev : current)
    //return array.sort((a,b)=>a.age<b.age)[0]
    return array.reduce((a,b)=>a.age>b.age?a:b)
}

// function maxBy(array: number[], iteratee) {
//   let result
//   if (array == null) {
//     return result
//   }
//   let computed
//   for (const value of array) {
//     const current = iteratee(value)
//
//     if (current != null && (computed === undefined
//       ? (current === current && !isSymbol(current))
//       : (current > computed)
//     )) {
//       computed = current
//       result = value
//     }
//   }
//   return result
// }


// function _reset(): number {
//     const i = -1;
//     const cw = 0;
//     let maxS = 0;
//     let gcdS = 0;
//
//     maxS = 0;
//
//     return 0;
// }


export {
    max, maxSort , cycle, cycleX, cycleY
}