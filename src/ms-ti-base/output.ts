export const prettyJSON = (str:any): string => {
    return JSON.stringify(str, null, 4);
}