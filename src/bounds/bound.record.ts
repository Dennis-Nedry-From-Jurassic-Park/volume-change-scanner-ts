interface BoundCommon {
    name: string,
    isReversed: boolean
    comparisonOperator: string,
}

interface BoundRecord extends BoundCommon {
    start: number
    end: number
}

interface BoundScoreRecord extends BoundCommon {
    goldRatio: number
}

export class InvestmentIndicatorBound implements BoundRecord {
    name:string
    start: number
    end: number
    isReversed: boolean;
    comparisonOperator: string;

    constructor(name: string, start: number, end: number, isReversed: boolean, comparisonOperator: string) {
        this.name = name;
        this.start = start;
        this.end = end;
        this.isReversed = isReversed;
        this.comparisonOperator = comparisonOperator;
    }

    getBuffetIndicators():number[] {
        return [0, this.start / 3, this.start / 2, this.start, this.end, this.end * 2, this.end * 3, 100, 250, 500, 1000]
    }

    getBound():string {
        return `[${this.name} in range [${this.start} .. ${this.end}] is good.
                ${this.name} ${this.comparisonOperator} ${this.end} is excellent.`;
    }
}

export class InvestmentIndicatorBoundScore implements BoundScoreRecord {
    constructor(
        public name:string,
        public goldRatio:number,
        public isReversed: boolean,
        public comparisonOperator:string
    ) {};

    getBuffetIndicators():number[] {
        return [0, this.goldRatio / 3, this.goldRatio / 2, this.goldRatio, this.goldRatio * 2, this.goldRatio * 3, 100, 250, 500]
    }

    getBound():string {
        return `[${this.name} must be ${this.comparisonOperator} than ${this.goldRatio}].`;
    }
}
