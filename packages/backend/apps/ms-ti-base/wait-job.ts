import moment from "moment";

class WaitJob {
    private readonly time: string;
    private readonly format: string;
    private readonly closeWorkerAfterMinutes: number;

    private startJobAt: moment.Moment;

    private readonly firstJobAt: string;
    private readonly secondJobAt: string;
    private readonly thirdJobAt: string;

    constructor(
        time: string,
        format: string = 'HH:mm:ss',
        closeWorkerAfterMinutes: number = 10,
    ) {
        this.time = time;
        this.format = format;
        this.closeWorkerAfterMinutes = closeWorkerAfterMinutes;

        (function () {
            this.startJobAt = moment(this.time, this.format);

        })();

        {
            //this.startJobAt = moment(this.time, this.format);
        }

        this.firstJobAt = this.startJobAt.format(this.format)
        this.secondJobAt = this.startJobAt.add(this.closeWorkerAfterMinutes, 'minutes').format(this.format);
        this.thirdJobAt = this.startJobAt.add(2 * this.closeWorkerAfterMinutes, 'minutes').format(this.format);
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

    getCloseWorkerAfterMinutes() {
        return this.closeWorkerAfterMinutes
    }
}