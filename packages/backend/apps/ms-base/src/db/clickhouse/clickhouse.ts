import {ClickHouse, QueryCursor} from "clickhouse";
import {v4} from "uuid";
import {logger_clickhouse} from "../../logger/logger";
import {prettyJSON} from "../../../../ms-ti-base/output";

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
	url: 'http://clickhouse',
	port: 8123, // Port 9000 is for clickhouse-client program.
	debug: true,
	basicAuth: {
		username: 'default',
		password: '',
	},
	usePost: true,
	isUseGzip: false,
	trimQuery: false,
	format: 'json',
	raw: false,
	config: {
		session_id                              : v4(),
		session_timeout                         :  0,
		output_format_json_quote_64bit_integers :  0,
		enable_http_compression                 :  0,
		database                                : '',
		log_queries								:  1, // профилирование запросов, результат смотреть в system.log_queries
		max_query_size: 1000000000,
		max_parser_depth: 1000000000,
		max_bytes_to_read: 1000000000,
		max_rows_to_read: 1000000000,
		http_max_field_value_size: 1000000000
	}
});

export default clickhouse;