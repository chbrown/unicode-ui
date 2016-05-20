var path = require('path');
var webpack = require('webpack');

var env = process.env.NODE_ENV || 'development';

module.exports = {
  entry: {
    app: './app',
    unidata: ['unidata'],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },
  plugins: [
    // exclude unidata from bundle.js and include it separately
    new webpack.optimize.CommonsChunkPlugin({
      name: 'unidata',
      filename: 'unidata.js',
    }),
    // enable production builds:
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    ...(env === 'development' ? [
      new webpack.NoErrorsPlugin(),
    ] : [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin(),
    ]),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
