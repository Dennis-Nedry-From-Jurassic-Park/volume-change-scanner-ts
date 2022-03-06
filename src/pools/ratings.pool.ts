import Pool from './pool';
import {scoreBoundRange} from '../bounds/score';

let metric = scoreBoundRange.AltmanZscore;

export const altmanZscorePool = new Pool({
	metricName: metric.name,
	bound: metric.getBound(),
	buffetIndicators: metric.getBuffetIndicators(),
	isReversed: metric.isReversed
});

metric = scoreBoundRange.PiotroskiFscore;

export const piotroskiFscorePool = new Pool({
	metricName: metric.name,
	bound: metric.getBound(),
	buffetIndicators: metric.getBuffetIndicators(),
	isReversed: metric.isReversed
});

metric = scoreBoundRange.BeneishMscore;

export const beneishMscorePool = new Pool({
	metricName: metric.name,
	bound: metric.getBound(),
	buffetIndicators: metric.getBuffetIndicators(),
	isReversed: metric.isReversed
});