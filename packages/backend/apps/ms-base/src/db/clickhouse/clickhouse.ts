import {ClickHouse, QueryCursor} from "clickhouse";
import {v4} from "uuid";
import {logger_clickhouse} from "../../logger/logger";
import {prettyJSON} from "../../../../ms-ti-base/output";

class ClickHouseExt extends ClickHouse {
	constructor(
		url: string = 'localhost', // clickhouse
		debug: boolean = false,
		raw: boolean = false,

	){
		super({
			url: `http://${url}`, // http://localhost:8123
			port: 8123, // Port 9000 is for clickhouse-client program.
			debug: debug,
			basicAuth: {
				username: 'default',
				password: '',
			},
			usePost: true,
			isUseGzip: false,
			trimQuery: false,
			format: 'json',
			raw: raw,
			config: {
				session_id                              : v4(),
				session_timeout                         :  0,
				output_format_json_quote_64bit_integers :  0,
				enable_http_compression                 :  0,
				database                                : '',
				log_queries								:  0, // профилирование запросов, результат смотреть в system.log_queries
				//max_execution_time: 300,
				max_query_size: 10000000000000,
				max_parser_depth: 10000000000000,
				max_bytes_to_read: 10000000000000,
				max_rows_to_read: 10000000000000,
				http_max_field_value_size: 10000000000000,
				//min_insert_block_size_rows: 100000,
				max_insert_block_size : 100000,
				//read_backoff_max_throughput: 1000000000
				// read_backoff_min_latency_ms: 100000
				// max_insert_threads: 8,
				// max_threads: 8,
			}
		});
	}

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

const clickhouse = new ClickHouseExt();
export const clickhouse_localhost = new ClickHouseExt('localhost', false, false);

export default clickhouse;