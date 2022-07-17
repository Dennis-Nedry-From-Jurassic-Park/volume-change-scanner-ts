import {rangeExclusive} from '../ranges/range';
import COLOR from '../utils/color';

const WRRPool = require('wrr-pool');

const unknownValue = -404;

const enum WeightType {
    Company = 0,
    Buffet = 1
}

const enum ErrorMsg {
    MissedRange = 'Indicator has not exist in range [ start, end ] of current pool'
}

export default class Pool extends WRRPool {
    private readonly weightedBuffetIndicator: Record<number, number[]> = {};
    private readonly weightedCompanyIndicator: Record<number, number[]> = {};
    private readonly weightedTotalIndicator: Record<number, number[]> = {};

    private metricName:string;

    constructor({
    	metricName,
    	bound,
    	buffetIndicators,
    	isReversed
    } : {
        metricName:string,
        bound: string,
        buffetIndicators: number[],
        isReversed: boolean
    }) {
    	super();

    	this.metricName = metricName;

    	if (buffetIndicators) {
    		this.weightedBuffetIndicator = this.prepareBuffetWeights(buffetIndicators, isReversed!);
    		this.setWeights(bound, metricName, WeightType.Buffet);
    		//console.log(metricName);
    	}
    }

    // ---------------------------- QuantitativePool -----------------------------------
    getCountryWeight = (indicator: number) => this.getWeightForIndicator(indicator);
    getRecommendationKeyWeight = (indicator: number) => this.getWeightForIndicator(indicator);
    getPEWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getPBRatioWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getPriceToSalesWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getPEGWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getPriceOverFCFWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getPTBVWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getPNCAVWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getEVEBWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getEnterpriseValueToOperatingCashFlowWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getEVtoSalesRatioWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    // ------------------------------- HealthPool --------------------------------------
    getCurrentRatioWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getQuickRatioWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getFlowRatioWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getLiabilitiesEquityWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getDebtToEbitdaWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getDebtToEquityWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getDebtNCAVWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getLongTermDebtOverWorkingCapitalWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    // ----------------------------- EfficiencyPool ------------------------------------
    getROEWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getROAWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getROTAWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getROICWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getROCEWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    // ------------------------------- GrowthPool --------------------------------------
    getEarningsYieldWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getEbitYieldWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getEbitdaYieldWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getFCFYieldWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getFPEOverTPEWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getOCFOverEPSWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getFCFOverSalesWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    // ------------------------------ RatingsPool --------------------------------------
    getAltmanZScorePoolWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getPiotroskiFScorePoolWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);
    getBeneishMScorePoolWeight = (indicator: number) => this.getWeightFromIndicatorsRange(indicator);

    getWeightForIndicator(indicator:any) {
    	if (indicator) {
    		try {
    			const obj = this.get(function (pool:any) {
    				return pool.indicator.includes(indicator);
    			});

    			const {
    				color,
    				metric,
    				bound
    			} = obj.value;

    			return obj.weight;
    		} catch (error) {
    			console.log(error);
    			return null;
    		}
    	} else {
    		return unknownValue;
    	}
    }

    getWeightFromIndicatorsRange(indicator: number, weightType: WeightType = WeightType.Buffet) {
        const obj = this.get( (pool:Pool) => {
            				return pool.weightType === weightType &&
                                    (indicator >= pool.min && indicator <= pool.max);
            			});

            			//if (obj === undefined) throw new Error(ErrorMsg.MissedRange);

//             			const {
//             				color,
//             				min,
//             				max,
//             				bound,
//             				metric
//             			} = obj.value;

            			return obj.weight;
    }

    getWeightFromIndicatorsRange0(indicator: number, weightType: WeightType = WeightType.Buffet) {
    	if (indicator) {
    		try {
    			const obj = this.get(function (pool:any) {
    				return pool.weightType === weightType &&
                            (indicator >= pool.min && indicator <= pool.max);
    			});

    			if (obj === undefined) throw new Error(ErrorMsg.MissedRange);

    			const {
    				color,
    				min,
    				max,
    				bound,
    				metric
    			} = obj.value;

    			return obj.weight;
    		} catch (error) {
    			console.log(error);
    			return unknownValue;
    		}
    	} else {
    		return unknownValue;
    	}
    }

    getMetricName = () => this.metricName;

    getROAWeight0 (indicator: number) {
             return this.getWeightFromIndicatorsRange(indicator);
         }

    getWeight = (object: any, value: number) => this.getKeyByValue(object, value);

    private getKeyByValue(object: any, value: number) {
    	return Object
    		.keys(object)
    		.find(key =>
    			(value >= Math.min(...object[key]) && value <= Math.max(...object[key]))
    		);
    }

    getKeysWithHighestValue(o:any, n:number){
    	const keys = Object.keys(o);
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

    	const arrArrs = [];
    	const precision = 0.000000001;

    	for (let _i = 0; _i < weights.length-1; _i++) {
    		const cur  = weights[_i];
    		const next = weights[_i + 1];

    		arrArrs.push([cur.toFixed(5), next - precision]);
    	}

    	const obj:any = {};

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
    }

    public setWeights(
    	bound?:string,
    	metricName?:string,
    	weightType?:WeightType
    ) {
    	const weightedRanges = (weightType === WeightType.Buffet)
    		? this.getWeightedBuffetIndicator() : this.getWeightedCompanyIndicator();
    	for (const [weight, range] of Object.entries(weightedRanges)) {
    		this.add(
    			{
    				min: Math.min(...range),
    				max: Math.max(...range),
    				color: undefined,
    				bound: undefined,
    				metric: undefined,
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