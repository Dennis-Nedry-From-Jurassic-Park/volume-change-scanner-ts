import Pool from '../pool';
import {efficiencyBoundRange} from '../../bounds/efficiency';

const metric = efficiencyBoundRange.ROA;

export const roaPool = new Pool({
	metricName: metric.name,
	bound: metric.getBound(),
	buffetIndicators: metric.getBuffetIndicators(),
	isReversed: metric.isReversed
});