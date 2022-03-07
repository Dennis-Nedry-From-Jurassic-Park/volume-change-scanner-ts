import {ClickHouse} from 'clickhouse';

ClickHouse.prototype.logQueries = async (queries:any[] = [1,2]) => {
	for(const query of queries) {
		const r = await clickhouse.query(query).toPromise();

		console.log(query, r);
	}
};

const clickhouse = new ClickHouse({
	url: 'http://localhost',
	port: 8123,
	debug: true,
	basicAuth: {
		username: 'default',
		password: '',
	},
	isUseGzip: false,
	format: 'json',
	raw: false,
	config: {
		session_id                              : '1',
		session_timeout                         :  90,
		output_format_json_quote_64bit_integers :  0,
		enable_http_compression                 :  0,
		database                                : 'db',
	}
});

export default clickhouse;