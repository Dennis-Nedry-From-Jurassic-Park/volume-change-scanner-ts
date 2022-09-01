import {InvestmentIndicatorBound} from './bound.record';

export const efficiencyBoundRange :
    Record<string, InvestmentIndicatorBound> = {
    	ROA: new InvestmentIndicatorBound ({ name: 'ROA', start: 7.5, end: 15.0, isReversed: true, comparisonOperator: '>=' }),
    	ROE: new InvestmentIndicatorBound ({ name: 'ROE', start: 12.5, end: 25.0, isReversed: false, comparisonOperator: '>=' }),
    	ROCE: new InvestmentIndicatorBound ({ name: 'ROCE', start: 10.0, end: 20.0, isReversed: false, comparisonOperator: '>=' }),
    	ROIC: new InvestmentIndicatorBound ({ name: 'ROIC', start: 12.5, end: 25.0, isReversed: false, comparisonOperator: '>=' }),
    	ROTA: new InvestmentIndicatorBound ({ name: 'ROTA', start: 12.5, end: 25.0, isReversed: false, comparisonOperator: '>=' }),
    };