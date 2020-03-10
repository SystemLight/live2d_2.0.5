const ph = require("path");

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = (env, argv) => {
    let workEnv = argv.mode;

    return {
        mode: workEnv,
        target: "web",
        context: __dirname,
        devtool: workEnv === "development" ? 'inline-source-map' : "source-map",
        devServer: {
            contentBase: './dist',
            index: 'index.html',
            openPage: '',
            inline: true,
            historyApiFallback: true,
            hot: false,
            hotOnly: false,
            open: true,
        },
        resolve: {
            extensions: [".js", ".ts"]
        },
        entry: {
            // "index": ["./src/lib/live2d.min.js", "./src/framework/Live2DFramework.js"]
            "index": "./src/index.js"
        },
        output: {
            filename: "[name].umd.js",
            path: ph.resolve(__dirname, "dist"),
            libraryTarget: 'umd2',
            globalObject: 'this'
        },
        externals: {},
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: [
                        /(node_modules|bower_components)/,
                        /live2d.min.js$/
                    ],
                    loader: 'babel-loader'
                },
                {
                    test: /\.ts$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader!ts-loader'
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin([
                {
                    from: __dirname + '/public',
                    to: __dirname + '/dist',
                    ignore: ['.*']
                }
            ]),
            new HtmlWebpackPlugin({
                hash: false,
                template: "./draft/index.html",
                filename: `index.html`,
            })
        ]
    }
};