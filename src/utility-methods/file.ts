import {promises as fsPromises} from 'fs';
import {join} from 'path';

const fs = require('fs');

import zip from 'yauzl';
import path from 'path';

export const isValidZipFile = (filePath) => {
    return zip.open(filePath, { lazyEntries: true }, (err, stream ) => {
        if (err) {
            console.log('fail to read ', filePath);
            return false;
        }
        console.log('success read ', filePath);
        return true;
    });
}


export async function syncAppendToFile(filename: string, data: any) {
    fs.appendFileSync(filename, data);
}

export async function asyncAppendToFile(filename: string, data: any) {
    fs.appendFile(filename, data, function (err) {
        if (err) throw err;
        console.log('Saved! Filename: ' + filename);
    });
}






export async function asyncWriteFile(filename: string, data: any) {
    /**
     * flags:
     *  - w = Open file for reading and writing. File is created if not exists
     *  - a+ = Open file for reading and appending. The file is created if not exists
     */
    try {
        await fsPromises.writeFile(join(__dirname, filename), data, {
            flag: 'w',
        });

        const contents = await fsPromises.readFile(
            join(__dirname, filename),
            'utf-8',
        );
        console.log(contents);

        return contents;
    } catch (err) {
        console.log(err);
        return 'Something went wrong';
    }
}

export async function asyncReadFile(filename: string) {
    try {
        const result = await fsPromises.readFile(
            join(__dirname, filename),
            'utf-8',
        );

        console.log(result);

        return result;
    } catch (err) {
        console.log(err);
        return 'Something went wrong'
    }
}