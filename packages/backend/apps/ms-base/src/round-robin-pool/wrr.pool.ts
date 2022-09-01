type Peers = {
    peersValues : any[],
    peersWeights : number[],
}

//type TPredicate = (pool: Pool) => any;

export class WrrPool {
    public peers: Peers = { peersValues : [], peersWeights : [] };

    private i = -1;
    private cw = 0;
    public maxS = 0;
    public gcdS = 0;

    constructor() {}

    get(num:number): number {
        let len = this.peers.peersValues.length;
        while ( len-- ) {
            const val = this.peers.peersValues[len];
            if(num >= val[0] && num <= val[1]) {
                return this.peers.peersWeights[len];
            }
        }
        return -404;
    }

    add(value:any, weight:number){
        this.peers.peersValues.push(value);
        this.peers.peersWeights.push(weight);
        this._reset();
    }

    _reset() {
            this.maxS = this.maxBy(this.peers.peersWeights).max;
            this.gcdS = this.peers.peersWeights.reduce((prev:number, curr:number) => { return this.gcd(prev, curr); });
        }

    gcd(a: number, b: number): number {
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

    maxBy(array: any[]): any {
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
}
