import {InvestmentIndicatorBound} from "./bound.record";

export const efficiencyBoundRange :
    Record<string, InvestmentIndicatorBound> = {
    ROA: new InvestmentIndicatorBound ('ROA', 7.5, 15.0,  true, '>='),
    ROE: new InvestmentIndicatorBound ('ROE', 12.5, 25.0,  false, '>='),
    ROCE: new InvestmentIndicatorBound ('ROCE', 10.0, 20.0,  false, '>='),
    ROIC: new InvestmentIndicatorBound ('ROIC', 12.5, 25.0,  false, '>='),
    ROTA: new InvestmentIndicatorBound ('ROTA', 12.5, 25.0,  false, '>='),
}