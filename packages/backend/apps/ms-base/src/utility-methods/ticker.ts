const convertFigiToTicker = async (api: any, figi: string) => {
	try {
		const { ticker, name } = await api.searchOne({figi: figi});
		return { ticker, name };
	} catch (err) {
		console.log(err);
	}
};

export default convertFigiToTicker;