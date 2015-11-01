'use strict';

var webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    // HtmlWebpackPlugin = require('html-webpack-plugin'),
    WebpackConfig = require('webpack-config');

module.exports = new WebpackConfig().extend({
    'webpack.config.js': function(config) {
        delete config.debug;
        delete config.devtool;
        delete config.output;

        return config;
    }
}).merge({
    entry: {
      'main': path.join(__dirname, 'index.js')
    },
    output: {
      filename:'[name].js',
      publicPath:__dirname.replace("src", "dist")
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        })
    ]
});
