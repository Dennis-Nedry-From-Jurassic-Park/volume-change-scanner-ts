const path = './src/db/generate-schema-from-protos/protos/instruments.proto'
const allFileContents = fs.readFileSync(path, 'utf-8');

let database = '';
let tables: any[] = [];
let tables_map = new Map<string, string>();

allFileContents.split(/\r?\n/).forEach((line:string) =>  {

    //console.log(`Line from file: ${line}`);

    const match_db = line.match(/\w*Service/g)
    const match_table_struct = line.match(/\w*Response/g)
    const match_table = line.match(/rpc \w* \(/g)
    if(match_db){
        database = match_db[0]
    }

    if(match_table && match_table_struct) {
        tables_map.set(
            // key hashmap
            match_table[0]
            .replaceAll('rpc ', '')
            .replaceAll(' (', ''),
            // value hashmap
            match_table_struct[0]//.replaceAll('Response', '')
        )
    }


    const match_SharesResponse = line.match(/message SharesResponse \(/g)
    if(match_SharesResponse){
        //let query = 'CREATE TABLE Shares (';
        //database = match_db[0]
    }


});
let used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);


console.log(`CREATE DATABASE IF NOT EXISTS ${database};`);
console.log(tables_map);

let line2: string = '';


// while(line2 = allFileContents.split(/\r?\n/).next()){
//     console.log(line2)
// }









const nReadlines = require('n-readlines');
const broadbandLines = new nReadlines(path);

let line;
let lineNumber = 1;

while (line = broadbandLines.next()) {
    console.log('Line ' + lineNumber + ': ' + line);
    line = line.toString();


    //console.log(`Line ${lineNumber} has: ${line.toString('ascii')}`);
    lineNumber++;

    const match_Share = line.match(/message Share \{/g)
    if(match_Share){
        let query = 'CREATE TABLE Shares (';

        while (line = broadbandLines.next()){
            let type_field = line.match(/\w* \w*/g)

            console.log(type_field)

            if(line.match(/message GetAccruedInterestsRequest/g)){
                break;
            }
        }
        break;
    }
}

console.log('end of file.');
used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

