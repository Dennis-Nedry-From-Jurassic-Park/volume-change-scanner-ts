import number from "extra-number";
import moment, {Moment} from "moment";

export const convert_to_timestamp = (moment: Moment, format: string = 'X'): number => {
    return +moment!.format(format)
}
export const convert_to_datetime = (timestamp: number): moment.MomentInput => {
    return moment(timestamp * 1e3).utc()
}