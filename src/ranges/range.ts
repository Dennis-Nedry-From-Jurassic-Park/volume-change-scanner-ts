export function rangeInclusive (start:number, stop:number, stepSize:number) {
	if (stop == null) {
		stop = start;
		start = 1;
	}
	if (stepSize == null) stepSize = 1;

	const steps = (stop - start) / stepSize;

	const set = [];
	for (let step = 0; step <= steps; step++) set.push(start + step * stepSize);

	return set;
}

export function rangeExclusive (start:number, stop:number, stepSize:number) : any {
	//if (stop == null) return rangeExclusive(1, start)
	if (stepSize == null) return rangeExclusive(start, stop, 1);

	const range = rangeInclusive(start, stop, stepSize);
	if (stop % stepSize === 0) range.pop();
	return range;
}