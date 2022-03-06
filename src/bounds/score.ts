import {InvestmentIndicatorBoundScore} from './bound.record';

export const scoreBoundRange :
    Record<string, InvestmentIndicatorBoundScore> = {
    	AltmanZscore: new InvestmentIndicatorBoundScore ('AltmanZscore', 3.5,   true, '>='),
    	PiotroskiFscore: new InvestmentIndicatorBoundScore ('PiotroskiFscore', 7.0,   true, '>='),
    	BeneishMscore: new InvestmentIndicatorBoundScore ('BeneishMscore', -3.0,   false, '<='),
    };