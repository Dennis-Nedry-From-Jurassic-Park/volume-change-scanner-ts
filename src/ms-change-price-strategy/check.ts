import {instrumentsService} from "../ms-base/instruments.service";

const exec = async () => {
    const resp = await instrumentsService.get_all_russian_shares();
    console.log(resp.length)
}
exec();