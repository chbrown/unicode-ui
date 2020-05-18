const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const mode = process.env.NODE_ENV || 'development'

module.exports = {
  mode,
  // exclude unidata from main bundle, to be included separately
  optimization: {
    splitChunks: {
      cacheGroups: {
        unidata: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]unidata[\\/]/,
          name: 'unidata',
          filename: '[name].js',
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/_template.html',
      favicon: 'src/favicon.ico',
    }),
    // enable production builds:
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
}
