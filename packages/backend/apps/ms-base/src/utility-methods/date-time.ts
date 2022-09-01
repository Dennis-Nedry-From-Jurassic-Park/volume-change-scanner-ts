import moment from 'moment';

const filterDataByDate = async (ops: any, startDate: any, endDate: any) => {
	const d1 = moment(startDate);
	const d2 = moment(endDate);

	return ops.filter(function (o: any) {
		const d = moment(o.date);
		return d.isBetween(d1, d2);
	});
};

export default filterDataByDate;