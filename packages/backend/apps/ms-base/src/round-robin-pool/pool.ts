function gcd_1(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);

  if (b > a) {
    b = [a, a = b][0];
  }

  while (true) {
    a %= b;
    if (a === 0) { return b; }
    b %= a;
    if (b === 0) { return a; }
  }
}

function gcd_2(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);

  if (b > a) {
    let temp = a;
    a = b;
    b = temp;
  }

  while (true) {
    a %= b;
    if (a === 0) { return b; }
    b %= a;
    if (b === 0) { return a; }
  }
}

function gcd_3(a: number, b: number): number {
    let max = Math.max(a, b);
    let min = Math.min(a, b);
    let mod = 0;

    while (min !== 0) {
        mod = max % min;
        max = min;
        min = mod;
    }

    return max;
}

function gcd_4(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);

  if (b > a) {
    a ^= b;
    b ^= a;
    a ^= b;
  }

  while (true) {
    a %= b;
    if (a === 0) { return b; }
    b %= a;
    if (b === 0) { return a; }
  }
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);

  if (b > a) {
    //b = [a, a = b][0];
       let temp = a;
       a = b;
       b = temp;
  }

  while (true) {
    a %= b;
    if (a === 0) { return b; }
    b %= a;
    if (b === 0) { return a; }
  }
}

function gcd_rec(a: number, b: number): number {
  return b ? gcd_rec(b, a % b) : Math.abs(a);
}

function gcd_r(a: number, b: number): number {
        if (a == 0)
            return b;
        return gcd_r(b % a, a);
    }

function gcd_full (...arr:any[]) {
  const _gcd:any = (x:any, y:any) => (!y ? x : gcd_full(y, x % y));
  return [...arr].reduce((a, b) => _gcd(a, b));
};

export {
    gcd,
    gcd_full,
    gcd_1,
    gcd_2,
    gcd_3,
    gcd_4,
    gcd_rec,
    gcd_r
}


/*
Progress: 100%

  gcd_1:
    176 874 378 ops/s, ±1.78%   | fastest

  gcd_2:
    136 144 178 ops/s, ±1.56%   | 23.03% slower

  gcd_3:
    120 224 053 ops/s, ±1.15%   | slowest, 32.03% slower

  gcd_4:
    133 581 756 ops/s, ±0.85%   | 24.48% slower

*/



// export const gcd = (...arr) => {
//   const _gcd = (x, y) => (!y ? x : gcd(y, x % y));
//   return [...arr].reduce((a, b) => _gcd(a, b));
// };

//export const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

//export function gcd = (a:number, b:number) => if (a == 0) return b; else return gcd(b % a, a);