import {Share} from "tinkoff-invest-api/cjs/generated/instruments";
import moment from 'moment';
import {prettyJSON} from "./../../ms-base/output";
const some_interface: any = {
    "figi": "BBG004S687W8",
    "ticker": "MSNG",
    "classCode": "TQBR",
    "isin": "RU0008958863",
    "lot": 1000,
    "currency": "rub",
    "shortEnabledFlag": false,
    "name": "Мосэнерго",
    "exchange": "MOEX",
    "issueSize": "39749359700",
    "countryOfRisk": "RU",
    "countryOfRiskName": "Российская Федерация",
    "sector": "utilities",
    "issueSizePlan": "28267726000",
    "tradingStatus": 4,
    "otcFlag": false,
    "buyAvailableFlag": true,
    "sellAvailableFlag": true,
    "divYieldFlag": true,
    "shareType": 1,
    "apiTradeAvailableFlag": true,
    "uid": "",
    "realExchange": 1,
    "klong": {
        "units": "2",
        "nano": 0
    },
    "kshort": {
        "units": "2",
        "nano": 0
    },
    "dlong": {
        "units": "0",
        "nano": 300000000
    },
    "dshort": {
        "units": "0",
        "nano": 300000000
    },
    "dlongMin": {
        "units": "0",
        "nano": 163300000
    },
    "dshortMin": {
        "units": "0",
        "nano": 140200000
    },
    "ipoDate": {
        "seconds": "735868800",
        "nanos": 0
    },
    "nominal": {
        "currency": "rub",
        "units": "1",
        "nano": 0
    },
    "minPriceIncrement": {
        "units": "0",
        "nano": 500000
    }
};


function isNumeric(num: any) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}

function isBoolean(val: any) {
    return val === false || val === true;
}

function isObject(val: any) {
    return val instanceof Object;
}


const ret_type = (val: any): string => {
    if (isNumeric(val)) {
        return 'Int64';
    } else if (typeof val === "boolean") {
        return 'Bool';
    } else if (typeof val === "string") {
        return 'String';
    } else if (isObject(val)) {
        let nested: string = ''
        nested += 'Nested(';
        for (let key in val) {
            const value = val[key];
            nested += key;

            let type = ret_type(value)

            nested += ' ' + type + ',';
        }
        nested = nested.slice(0, -1);
        nested += ')'
        return nested;
    }
    return 'String';
}

export const create_enum_field = async (enumFieldName: string, object: any, separator: string): Promise<string> => {
    let create = `${enumFieldName} Enum (`;
    //console.log(keys1);

    const keys = Object.keys(object).map(key => object[key]).filter(value => typeof value === 'string') as string[];
    //console.log(keys);
    for (let key of keys) {
        //onsole.log(object[key])
        //console.log(key)
        create += "'" + key + "'" + '=' + object[key] + ', '
    }
    create = create.slice(0, -2);
    create += '),'

    return create;
}

export const create_table = async (tableName: string, object: any, separator: string): Promise<string> => {
    const create_table = `CREATE TABLE IF NOT EXISTS ${tableName} `;

    let columns = create_table + `${separator}(${separator}`;

    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let type: any;
            const value = object[key];

            if(Array.isArray(value)){ // TODO: not worked
                const main_obj = value[0]
                Object.keys(main_obj).forEach((key:any) => {
                    columns += key + ' ' + ret_type(main_obj[key]) + ',';
                });
            }

            type = ret_type(value);

            columns += `${key} ${type},\n`
        }
    }

    columns = columns.slice(0, -2);
    columns += `${separator})`;
    columns += ' ENGINE = MergeTree() ORDER BY tuple();';

    return columns;
}

//create_table('shares');
create_table('TradingSchedules', some_interface, '\n');

const get_sep = (value: any): string => {
    if (isNumeric(value)) {
        return '';
    } else if (typeof value === "boolean") {
        return '';
    } else if (typeof value === "string") {
        return '\'';
    }
    return ''
}


export const insert_into_table = async (tableName: string, object:any, separator: string): Promise<string> => {
    let create_table = `INSERT INTO ${tableName} (*) VALUES ` + `${separator}(${separator}`;

    let all_values = '';

    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let value = object[key];

            if (isObject(value)) {
                // let nested_values: string = '['
                //
                // for (let key in value) {
                //     let val = value[key];
                //
                //     if(isBoolean(val)){
                //         val = +!!val;
                //     }
                //
                //     const sep = get_sep(val)
                //
                //     nested_values += sep + val + sep + ',';
                // }
                // nested_values = nested_values.slice(0, -1) + '],';
                // all_values += nested_values;

                let nested_values: string = '';

                for (let key in value) {
                    let val = value[key];

                    if(isBoolean(val)){
                        val = +!!val;
                    }

                    const sep = get_sep(val)

                    nested_values += '[' + sep + val + sep + '],';
                }
                nested_values = nested_values.slice(0, -1) + ',';
                all_values += nested_values + separator;
            } else {
                const sep = get_sep(value)

                if(isBoolean(value)){
                    value = +!!value;
                }

                all_values += sep + value.toString() + sep + ',' + separator
            }

            //values += `${all_values},\n`
        }
    }

    const query = create_table + all_values.slice(0, -1) + `${separator})`;

    //values = values.slice(0, -2);

    console.log(query)

    return query

}

//insert_into_table('shares', Share)
//insert_into_table_multiple('shares')









const some_interfaces: any = [
    {
    "figi": "2BG004S687W8",
    "ticker": "MSNG",
    "classCode": "TQBR",
    "isin": "RU0008958863",
    "lot": 1000,
    "currency": "rub",
    "shortEnabledFlag": false,
    "name": "Мосэнерго",
    "exchange": "MOEX",
    "issueSize": "39749359700",
    "countryOfRisk": "RU",
    "countryOfRiskName": "Российская Федерация",
    "sector": "utilities",
    "issueSizePlan": "28267726000",
    "tradingStatus": 4,
    "otcFlag": false,
    "buyAvailableFlag": true,
    "sellAvailableFlag": true,
    "divYieldFlag": true,
    "shareType": 1,
    "apiTradeAvailableFlag": true,
    "uid": "",
    "realExchange": 1,
    "klong": {
        "units": "2",
        "nano": 0
    },
    "kshort": {
        "units": "2",
        "nano": 0
    },
    "dlong": {
        "units": "0",
        "nano": 300000000
    },
    "dshort": {
        "units": "0",
        "nano": 300000000
    },
    "dlongMin": {
        "units": "0",
        "nano": 163300000
    },
    "dshortMin": {
        "units": "0",
        "nano": 140200000
    },
    "ipoDate": {
        "seconds": "735868800",
        "nanos": 0
    },
    "nominal": {
        "currency": "rub",
        "units": "1",
        "nano": 0
    },
    "minPriceIncrement": {
        "units": "0",
        "nano": 500000
    }
},
    {
    "figi": "1BG004S687W8",
    "ticker": "MSNG2",
    "classCode": "TQBR",
    "isin": "RU0008958863",
    "lot": 1000,
    "currency": "rub",
    "shortEnabledFlag": false,
    "name": "Мосэнерго",
    "exchange": "MOEX",
    "issueSize": "39749359700",
    "countryOfRisk": "RU",
    "countryOfRiskName": "Российская Федерация",
    "sector": "utilities",
    "issueSizePlan": "28267726000",
    "tradingStatus": 4,
    "otcFlag": false,
    "buyAvailableFlag": true,
    "sellAvailableFlag": true,
    "divYieldFlag": true,
    "shareType": 1,
    "apiTradeAvailableFlag": true,
    "uid": "",
    "realExchange": 1,
    "klong": {
        "units": "2",
        "nano": 0
    },
    "kshort": {
        "units": "2",
        "nano": 0
    },
    "dlong": {
        "units": "0",
        "nano": 300000000
    },
    "dshort": {
        "units": "0",
        "nano": 300000000
    },
    "dlongMin": {
        "units": "0",
        "nano": 163300000
    },
    "dshortMin": {
        "units": "0",
        "nano": 140200000
    },
    "ipoDate": {
        "seconds": "735868800",
        "nanos": 0
    },
    "nominal": {
        "currency": "rub",
        "units": "1",
        "nano": 0
    },
    "minPriceIncrement": {
        "units": "0",
        "nano": 500000
    }
}];


function isValidDate(date:any) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

export const insert_into_table_multiple
    = async (tableName: string, rows: any): Promise<string> => {
    let create_table = 'INSERT INTO ' + tableName + ' (*) VALUES ';

    rows.forEach((row:any) => {
        //console.log('row = ' + prettyJSON(row));
        let all_values = '(';
        //console.log(Object.keys(row))

        Object.keys(row).forEach((key:string) => {
            //console.log(row.hasOwnProperty(key))
            if (row.hasOwnProperty(key)) {
                let value:any = row[key];

                 if ( isValidDate(value)) {
                    const sep = get_sep(value)
                     // '(SELECT parseDateTimeBestEffortOrNull(\'' +
                     // + "'))"
                    all_values += sep + "'" + moment(value).format('YYYY-MM-DD hh:mm:ss')+ "'" + sep + ','
                }  else if (isObject(value)) {
                    // let nested_values: string = '['
                    //
                    // for (let key in value) {
                    //     let val = value[key];
                    //
                    //     if(isBoolean(val)){
                    //         val = +!!val;
                    //     }
                    //
                    //     const sep = get_sep(val)
                    //
                    //     nested_values += sep + val + sep + ',';
                    // }
                    // nested_values = nested_values.slice(0, -1) + '],';
                    // all_values += nested_values;

                    let nested_values: string = '';

                    for (let key in value) {
                        let val = value[key];

                        if(isBoolean(val)){
                            val = +!!val;
                        }

                        const sep = get_sep(val)

                        nested_values += '[' + sep + val + sep + '],';
                    }
                    nested_values = nested_values.slice(0, -1) + ',';
                    all_values += nested_values;
                }  else {
                    const sep = get_sep(value)

                    if(isBoolean(value)){
                        value = +!!value;
                    }

                    all_values += sep + value.toString() + sep + ','
                }

                //values += `${all_values},\n`
            }
        })
        create_table += all_values.slice(0, -1) + '),';
    })

    //for(const row of rows){
        //values = values.slice(0, -2);
    //}

    const q = create_table.slice(0, -1).replace(/(\r\n|\n|\r)/gm, "") + ';'

    const match_null = q.match(/null/g)
    const match_undefind = q.match(/undefind/g)

    console.log(match_null)
    console.log(match_undefind)

    return q
}


//insert_into_table_multiple('shares')