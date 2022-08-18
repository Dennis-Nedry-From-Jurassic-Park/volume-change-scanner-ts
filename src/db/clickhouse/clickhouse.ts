import {ClickHouse, QueryCursor} from "clickhouse";
import {v4} from "uuid";
import {logger_clickhouse} from "../../logger/logger";
import {prettyJSON} from "../../ms-base/output";

class ClickHouseExt extends ClickHouse {
	query(query: String, reqParams?: object): QueryCursor {
		try {
			clickhouse.sessionId = v4();
			logger_clickhouse.log('debug', clickhouse.sessionId);
			const resp = super.query(query, reqParams);
			logger_clickhouse.log('debug', prettyJSON(resp));
			return resp
		} catch(error:any){
			logger_clickhouse.log('error', error);
		}

		return QueryCursor.prototype
	}

	logQueries = async (queries:any[] = [1,2]) => {
		clickhouse.sessionId = v4();

		logger_clickhouse.log('debug', clickhouse.sessionId);
		logger_clickhouse.log('debug', queries);

		for(const query of queries) {
			try {
				const resp = await clickhouse.query(query).toPromise();

				logger_clickhouse.log('debug', prettyJSON(resp));
			} catch(error:any){
				logger_clickhouse.log('error', error);
			}
		}
	};
}

export const clickhouse = new ClickHouseExt({
	url: 'http://localhost',
	port: 8123, // Port 9000 is for clickhouse-client program.
	debug: true,
	basicAuth: {
		username: 'default',
		password: '',
	},
	isUseGzip: false,
	format: 'json',
	raw: false,
	config: {
		session_id                              : v4(),
		session_timeout                         :  0,
		output_format_json_quote_64bit_integers :  0,
		enable_http_compression                 :  0,
		database                                : '',
	}
});

export default clickhouse;