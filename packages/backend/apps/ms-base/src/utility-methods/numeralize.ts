const createCountFormatter = ({few, one, two}: {
        few: string,
        one: string,
        two: string
    }) => {
	const titles = [one, two, few];

	return (number: number): string => {
		const cases = [2, 0, 1, 1, 1, 2];

		return titles[
			number % 100 > 4 && number % 100 < 20
				? 2
				: cases[number % 10 < 5 ? number % 10 : 5]
		];
	};
};

export const formatBuySellCase = (number: number, genus: boolean, isBuy: boolean) => {
	const word = isBuy ? 'куплен' : 'продан';
	return createCountFormatter({
		one: genus ? `${word} ${number} ` : `${word}а ${number} `,
		two: genus ? `${word}о ${number} ` : `${word}ы ${number} `,
		few: `${word}о ${number} `,
	})(number);
};

export const formatFundCase = createCountFormatter({
	one: 'фонд',
	two: 'фонда',
	few: 'фондов'
});

export const formatStockCase = createCountFormatter({
	one: 'акция',
	two: 'акции',
	few: 'акций'
});

const ti = async () => {
	const numbers = [1, 2, 5];
	numbers.forEach(n => {
		console.log(formatBuySellCase(n, true, true) + formatFundCase(n));
	});

	numbers.forEach(n => {
		console.log(formatBuySellCase(n, false, true) + formatStockCase(n));
	});


	numbers.forEach(n => {
		console.log(formatBuySellCase(n, true, false) + formatFundCase(n));
	});

	numbers.forEach(n => {
		console.log(formatBuySellCase(n, false, false) + formatStockCase(n));
	});
};

ti();