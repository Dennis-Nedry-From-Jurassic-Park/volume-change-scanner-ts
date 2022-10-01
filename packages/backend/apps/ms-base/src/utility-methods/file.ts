import {createWriteStream, promises as fsPromises} from 'fs';
import {join} from 'path';

const fs = require('fs');

import zip from 'yauzl';
import path from 'path';
import axios from "axios";

export const isValidZipFile = (filePath:any) => {
    return zip.open(filePath, { lazyEntries: true }, (err:any, stream:any ) => {
        if (err) {
            console.log('fail to read ', filePath);
            return false;
        }
        console.log('success read ', filePath);
        return true;
    });
}

export function getAppRootDir() {
    let currentDir = __dirname
    while(!fs.existsSync(path.join(currentDir, '.root.dir'))) {
        currentDir = path.join(currentDir, '..')
    }
    return currentDir
}


export async function syncAppendToFile(filename: string, data: any) {
    fs.appendFileSync(filename, data);
}

export async function asyncAppendToFile(filename: string, data: any) {
    fs.appendFile(filename, data, function (err:any) {
        if (err) throw err;
        console.log('Saved! Filename: ' + filename);
    });
}






export async function asyncWriteFilef(filename: string, data: any) {
    /**
     * flags:
     *  - w = Open file for reading and writing. File is created if not exists
     *  - a+ = Open file for reading and appending. The file is created if not exists
     */
    try {
        await fsPromises.writeFile(filename, data, {
            flag: 'w',
        });

        const contents = await fsPromises.readFile(
            filename,
            'utf-8',
        );
        console.log(contents);

        return contents;
    } catch (err) {
        console.log(err);
        return 'Something went wrong';
    }
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
        //console.log(contents);

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

export async function downloadFile(fileUrl: string, outputLocationPath: string, headers: any) {
    console.log(fileUrl)

    const writer = createWriteStream(outputLocationPath);

    return axios({
        method: 'get',
        url: fileUrl,
        headers: headers,
        responseType: 'stream',
    }).then(response => {

        //ensure that the user can call `then()` only when the file has
        //been downloaded entirely.

        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error: any = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) {
                    resolve(true);
                }
                //no need to call the reject here, as it will have been called in the
                //'error' stream;
            });
        });
    });
}