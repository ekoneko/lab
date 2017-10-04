const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: 'index'
    },
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    output: {
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                loader: 'awesome-typescript-loader'
            }, {
                test: /\.scss/,
                loader: 'style-loader!css-loader!sass-loader'
            }, {
                test: /\.css/,
                loader: 'style-loader!css-loader'
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
    ],
    devtool: 'eval-source-map',
};
