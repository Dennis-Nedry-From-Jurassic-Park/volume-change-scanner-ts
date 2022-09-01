import { WrrPool } from './wrr.pool';

const check = () => {
    const wrrPool = new WrrPool();
    wrrPool.peers = {
        peersValues : [
            [0, 0.99999999],
            [1, 5.99999999],
            [6, 9.99999999],
            [10, 24.99999999]
        ],
        peersWeights : [
            1,
            0.9,
            0.75,
            0.5
        ]
    }

    const w = wrrPool.get(0.722223)
    const w2 = wrrPool.get(12.722223)

    console.log(w)
    console.log(w2)

    let a = 1;
    let b = 2;
    b = [a, a = b][0];
    console.log(a, b)
}

check();