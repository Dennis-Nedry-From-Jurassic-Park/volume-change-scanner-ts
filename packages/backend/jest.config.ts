import 'jest-ts-auto-mock'
import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    bail: 15,
    transform: {
        ".(ts|tsx)": "ts-jest"
    },
    globals: {
        "testPathIgnorePatterns ": [
            "/assets/",
            "/dist/",
            "/node_modules/"
        ],
        "testMatch": [
            "*.test.(ts|js)",
            "*.spec.(ts|js)"
        ],
        "ts-jest": {
            "tsconfig": "tsconfig.json",
            "compiler": "ttypescript",
        }
    }
};
export default config;