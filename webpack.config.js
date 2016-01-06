var path = require('path');
var webpack = require('webpack');

var production = process.env.NODE_ENV == 'production';
var extraPlugins = production ? [
  new webpack.optimize.UglifyJsPlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
] : [];

module.exports = {
  entry: {
    app: './app.tsx',
    unidata: ['unidata'],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },
  plugins: [
    // exclude unidata from bundle.js and include it separately
    new webpack.optimize.CommonsChunkPlugin('unidata', 'unidata.js'),
  ].concat(extraPlugins),
  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
    ],
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['babel-loader', 'ts-loader'],
        include: __dirname,
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        include: __dirname,
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
