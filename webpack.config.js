const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

let files = glob.sync('*.html', {})

let plugins;
plugins = files.map(
    file => {
        console.log(file.substr(0, file.length - 5))
        return new HtmlWebpackPlugin({
            template: file,
            filename: file,
            scriptLoading: 'defer',
            inject: true,
            chunks: [file.substr(0, file.length - 5)]
        });
    }
);

module.exports = {
    mode: "development",
    entry: {
        index: {
            import: "./index.js",
        },
        map: {
            import: "./map.js"
        }
    },
    output: {
        path: __dirname + '/dist',
        filename: "[name].bundle.js",
        clean: true
    },
    devServer: {
        port: 3000
    },
    optimization: {
        minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
        usedExports: true,
        minimize: true,
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test: /\.jpe?g$|\.avif$|\.png$|\.webp$|\.svg$|\.txt$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]?[hash]',
                    publicPath: '/'
                },
                enforce: 'post'
            },
            {
                test: /\bmapbox-gl-csp-worker.js\b/i,
                use: {loader: 'worker-loader'}
            },
            {
                "test": /\.less$/,
                "use": [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {url: false}
                    },
                    "less-loader"
                ],
            },
            {
                "test": /\.css$/,
                "use": [
                    MiniCssExtractPlugin.loader, "css-loader"
                ]
            },
            {
                "test": /\.fcss$/,
                loader: "file-loader",
                options: {name: "[name].css"},
                enforce: 'post'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({chunkFilename: '[name].css'}),
        new webpack.DefinePlugin({"MAP_KEY": `"${process.env.MAP_KEY}"`}),
    ].concat(plugins)
}
