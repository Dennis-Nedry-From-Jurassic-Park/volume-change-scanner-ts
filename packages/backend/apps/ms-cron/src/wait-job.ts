import moment from "moment";

export default class WaitJob {
    private readonly time: string;
    private readonly format: string;
    private readonly new_format: string;
    private readonly closeWorkerAfterMinutes: number;

    private startJobAt: moment.Moment;

    private readonly firstJobAt: string;
    private readonly secondJobAt: string;
    private readonly thirdJobAt: string;
    private readonly portfolioBalanceJobAt: string;

    constructor(
        time: string,
        format: string = 'HH:mm:ss',
        new_format: string = 'ss mm HH',
        closeWorkerAfterMinutes: number = 2.5,
    ) {
        this.time = time;
        this.format = format;
        this.new_format = new_format;
        this.closeWorkerAfterMinutes = closeWorkerAfterMinutes;

        this.portfolioBalanceJobAt = moment(this.time, this.format).format(this.new_format);
        this.startJobAt = moment(this.time, this.format);
        this.firstJobAt = this.startJobAt.format(this.new_format)
        this.secondJobAt = this.startJobAt.add(this.closeWorkerAfterMinutes, 'minutes').format(this.new_format);
        this.thirdJobAt = this.startJobAt.add(2 * this.closeWorkerAfterMinutes, 'minutes').format(this.new_format);
    }

    getFirstJobAt() {
        return this.firstJobAt
    }

    getSecondJobAt() {
        return this.secondJobAt
    }

    getThirdJobAt() {
        return this.thirdJobAt
    }

    getPortfolioBalanceJobAt() {
        return this.portfolioBalanceJobAt
    }

    getCloseWorkerAfterMinutes() {
        return this.closeWorkerAfterMinutes
    }
}