/* eslint-disable @typescript-eslint/no-var-requires */

require('source-map-support').install();

// https://webpack.js.org/plugins/terser-webpack-plugin/
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function (options) {
    return {
        ...options,
        devtool: 'source-map',
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    test: /\.js(\?.*)?$/i,
                }),
            ],
        },
    };
};
