import 'jest-ts-auto-mock'
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    bail: 15,
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        ".(ts|tsx)": "ts-jest",
        "^.+\\.(t|j)s$": "ts-jest"
    },
    globals: {
        "testPathIgnorePatterns ": [
            "/.cache.ti.api.gs.ru.shares.report/",
            "/assets/",
            "/benchmark/",
            "/dist/",
            "/node_modules/"
        ],
        "testMatch": [
            "*.(test|spec).(ts|js)"
        ],
        "ts-jest": {
            "tsconfig": "tsconfig.json",
            "compiler": "ttypescript",
        }
    }
};
export default config;