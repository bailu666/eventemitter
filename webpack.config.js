var path = require('path');

module.exports = {
    entry: {
        'eventemitter': './src/EventEmitter',
    },
    mode: 'development',
    devtool: false,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),
        library: 'EventEmiiter',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env'],
                        // plugins: ['babel-plugin-transform-runtime']
                    }
                }
            }
        ]
    }
};
