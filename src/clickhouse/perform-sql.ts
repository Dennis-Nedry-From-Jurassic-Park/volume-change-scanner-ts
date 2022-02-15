const index = require('jsontosql2');

const performSql = async (dbName: string = 'db', tableName: string, objects: any[]) => {
    const collection = {
        'name': `${dbName}.${tableName}`,
        'data': objects
    };
    const sql = index.toInsertSql(collection);

    let performedSQL = sql.replaceAll('`', '');

    console.log('JsonToInsertSql : ' + performedSQL);

    return [performedSQL];
};

export default performSql