import { readFileSync, writeFileSync, promises as fsPromises } from 'fs';
import { join } from 'path';

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
    console.log(contents); // 👉️ "One Two Three Four"

    return contents;
  } catch (err) {
    console.log(err);
    return 'Something went wrong';
  }
}