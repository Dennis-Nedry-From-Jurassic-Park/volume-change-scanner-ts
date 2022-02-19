import {rangeExclusive} from "../ranges/range";
import COLOR from '../utils/color';
const WRRPool = require('wrr-pool');

const unknownValue = -404;

export enum WeightType {
    Company = 0,
    Buffet = 1
}

export enum ErrorMsg {
    MissedRange = 'Indicator has not exist in range [ start, end ] of current pool'
}

export default class Pool extends WRRPool {
    private readonly weightedBuffetIndicator: Record<number, number[]> = {};
    private readonly weightedCompanyIndicator: Record<number, number[]> = {};
    private readonly weightedTotalIndicator: Record<number, number[]> = {};

    constructor({
                    metricName,
                    bound,
                    buffetIndicators,
                    isReversed
                } : {
        metricName?:string,
        bound?: string,
        buffetIndicators?: number[],
        isReversed?: boolean
    }) {
        super();

        if (buffetIndicators) {
            this.weightedBuffetIndicator = this.prepareBuffetWeights(buffetIndicators, isReversed!!);
            this.setWeights(bound, metricName, WeightType.Buffet);
            console.log(metricName)

            if(metricName === 'PE'){
                console.log(this.weightedBuffetIndicator)
            }
        }

        function getWeightForIndicator(indicator:any) {
            if (indicator) {
                try {
                    const obj = this.get(function (pool:any) {
                        return pool.indicator.includes(indicator)
                    });

                    const {
                        color,
                        metric,
                        bound
                    } = obj.value;

                    console.log(`${metric} = ${indicator} : ${color}${metric}Weight ${COLOR.purple} = ${color} ${obj.weight}.${COLOR.purple} Range = [${COLOR.yellow}${indicator} ${COLOR.purple}.. ${COLOR.yellow}${indicator}${COLOR.purple}]${COLOR.reset}. Recommended range: ${COLOR.purple}${bound}${COLOR.reset}`);

                    return obj.weight
                } catch (error) {
                    console.log(error);
                    return null;
                }
            } else {
                return unknownValue;
            }
        }

        function getWeightFromIndicatorsRange(
            indicator: any,
            weightType: WeightType = WeightType.Buffet
        ) {
            if (indicator) {
                try {
                    const obj = this.get(function (pool:any) {
                        return pool.weightType === weightType &&
                            (indicator >= pool.min && indicator <= pool.max)
                    });

                    if (obj === undefined) throw new Error(ErrorMsg.MissedRange);

                    const {
                        color,
                        min,
                        max,
                        bound,
                        metric
                    } = obj.value;

                    console.log(`${metric} = ${indicator} : ${color}${metric}Weight ${COLOR.purple}=${color} ${obj.weight}.${COLOR.purple} Range = [${COLOR.yellow}${min} ${COLOR.purple}.. ${COLOR.yellow}${max}${COLOR.purple}]${COLOR.reset}. Recommended range: ${COLOR.purple}${bound}${COLOR.reset}`);
                    return obj.weight
                } catch (error) {
                    console.log(error);
                    return unknownValue;
                }
            } else {
                return unknownValue;
            }
        }

        // ---------------------------- QuantitativePool -----------------------------------
        Pool.prototype.getCountryPoolWeight = getWeightForIndicator;
        Pool.prototype.getRecommendationKeyWeight = getWeightForIndicator;
        Pool.prototype.getPEpoolWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getPBratioWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getPriceToSalesWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getPegWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getPriceOverFCFWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getPTBVweight = getWeightFromIndicatorsRange;
        Pool.prototype.getPNCAVweight = getWeightFromIndicatorsRange;
        Pool.prototype.getEVEBweight = getWeightFromIndicatorsRange;
        Pool.prototype.getEnterpriseValueToOperatingCashFlowWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getEVtoSalesRatioWeight = getWeightFromIndicatorsRange;
        // ------------------------------- HealthPool --------------------------------------
        Pool.prototype.getCurrentRatioWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getQuickRatioWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getFlowRatioWeight = getWeightFromIndicatorsRange;

        Pool.prototype.getLiabilitiesEquityWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getDebtToEbitdaWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getDebtToEquityWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getDebtNCAVweight = getWeightFromIndicatorsRange;
        Pool.prototype.getLongTermDebtOverWorkingCapitalWeight = getWeightFromIndicatorsRange;
        // ----------------------------- EfficiencyPool ------------------------------------
        Pool.prototype.getROEweight = getWeightFromIndicatorsRange;
        Pool.prototype.getROAweight = getWeightFromIndicatorsRange;
        Pool.prototype.getROTAweight = getWeightFromIndicatorsRange;
        Pool.prototype.getROICweight = getWeightFromIndicatorsRange;
        Pool.prototype.getROCEweight = getWeightFromIndicatorsRange;
        // ------------------------------- GrowthPool --------------------------------------
        Pool.prototype.getEarningsYieldWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getEbitYieldWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getEbitdaYieldWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getFCFyieldWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getFPEoverTPEweight = getWeightFromIndicatorsRange;
        Pool.prototype.getOCFoverEPSweight = getWeightFromIndicatorsRange;
        Pool.prototype.getFCFoverSalesWeight = getWeightFromIndicatorsRange;
        // ------------------------------ RatingsPool --------------------------------------
        Pool.prototype.getAltmanZscorePoolWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getPiotroskiFscorePoolWeight = getWeightFromIndicatorsRange;
        Pool.prototype.getBeneishMscorePoolWeight = getWeightFromIndicatorsRange;
    }

    getWeight = (object: any, value: number) => this.getKeyByValue(object, value);

    private getKeyByValue(object: any, value: number) {
        return Object
            .keys(object)
            .find(key =>
                (value >= Math.min(...object[key]) && value <= Math.max(...object[key]))
            );
    }

    getKeysWithHighestValue(o:any, n:number){ // console.log(getKeysWithHighestValue(obj, 10))
        let keys = Object.keys(o);
        keys.sort(function(a,b){ return o[b] - o[a]; });
        console.log(keys);
        return keys.slice(0,n);
    }

    prepareWeights = (indicators: number[], isReversed: boolean) => {
        let weights = indicators;

        weights.push(0);

        weights = weights.sort((n1:number,n2:number) => n1 - n2);

        for (let _i = 0; _i < weights.length-1; _i++) {
            const min = weights[_i];
            const max = weights[_i+1]; // const step = (max/min) >= 5 ? 100 : 0.05;
            const step = (min === 0) ? 0.05 : (max <= 50 && (max/min) >= ((max < 0) ? 0.1 : 1)) ? 0.1 : 25;

            const values = rangeExclusive(min + step, max - step, step);

            values.forEach((value: any) => { weights.push(value); });
        } // TODO: теряется точность

        // '0.9575504523312788': [ 94.8, 94.849999999 ],
        //                         94.85
        // '0.9578983994433178': [ 94.85000000000001, 94.899999999 ],

        weights = weights.sort((n1:number,n2:number) => n1 - n2);

        let arrArrs = [];
        let precision = 0.000000001;

        for (let _i = 0; _i < weights.length-1; _i++) {
            const cur  = weights[_i];
            const next = weights[_i + 1];


            arrArrs.push([cur.toFixed(5), next - precision]);
        }

        let obj:any = {};

        const totalWeight = 1;
        let currentWeight:number = !isReversed ? totalWeight : 0;
        const stepWeight = totalWeight / arrArrs.length;

        for (let _i = 0; _i < arrArrs.length; _i++) {
            const currArr = arrArrs[_i];
            const index = currentWeight;
            obj[index] = currArr;

            if(isReversed){
                currentWeight += stepWeight;
            } else {
                currentWeight -= stepWeight;
            }
        }

        return obj;
    };

    public prepareBuffetWeights (buffetIndicators: number[], isReversed: boolean) {
        return this.prepareWeights(buffetIndicators, isReversed);
    };

    public setWeights(
        bound?:string,
        metricName?:string,
        weightType?: WeightType
    ) {
        const weightedRanges = (weightType === WeightType.Buffet)
            ? this.getWeightedBuffetIndicator() : this.getWeightedCompanyIndicator();
        for (const [weight, range] of Object.entries(weightedRanges)) {
            this.add(
                {
                    min: Math.min(...range),
                    max: Math.max(...range),
                    color: COLOR.red,
                    bound: bound,
                    metric: metricName,
                    weightType: weightType
                },
                parseFloat(weight)
            );
        }
    }

    prepareCompanyWeights = (indicators: number[], isReversed: boolean) => {
        return this.prepareWeights(indicators, isReversed);
    };

    getWeightedBuffetIndicator() {
        return this.weightedBuffetIndicator;
    }
    getWeightedCompanyIndicator() {
        return {};
    }
}