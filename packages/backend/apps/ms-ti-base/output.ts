export const prettyJSONbigint = (response:any): string => {
    return JSON.stringify(response, (_, v) => typeof v === 'bigint' ? v.toString() : v)
}
export const prettyJSON = (str:any): string => {
    return JSON.stringify(str, null, 4);
}