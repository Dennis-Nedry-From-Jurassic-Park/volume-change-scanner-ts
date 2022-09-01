import {InvestmentIndicatorBoundScore} from './bound.record';

export const scoreBoundRange :
    Record<string, InvestmentIndicatorBoundScore> = {
    	AltmanZscore: new InvestmentIndicatorBoundScore ('Altman Z-Score', 3.5,   true, '>='),
    	PiotroskiFscore: new InvestmentIndicatorBoundScore ('Piotroski F-Score', 7.0,   true, '>='),
    	BeneishMscore: new InvestmentIndicatorBoundScore ('Beneish M-Score', -3.0,   false, '<='),
    };