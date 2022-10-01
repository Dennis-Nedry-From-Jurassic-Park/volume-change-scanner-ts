import median from 'ml-array-median';

import boxplot from '@sgratzl/boxplots';
import {prettyJSON} from "../../../ms-ti-base/output";

const exec = async () => {

    const result = median([1, 5, 3, 2, 4, 11, 600]);
    console.log(result);
    console.log(prettyJSON(boxplot([1, 5, 3, 2, 4, 11, 600])));
    console.log(boxplot([1, 5, 3, 2, 4, 11, 600]));
}

exec();