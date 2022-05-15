export const _stringify = async (response: any): Promise<string> => {
    return JSON.stringify(response, (_, v) => typeof v === 'bigint' ? v.toString() : v)
}