
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

export default {
  resolve: {
    extensions: ['', '.js']
  },
  debug: true,
  devtool: 'source-map',
  noInfo: true,
  entry: path.resolve(__dirname, 'client/src/index'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
      'Promise': 'es6-promise'
    }),
    new WebpackMd5Hash(), // Using md5 to change names.

    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: false
    }),

    new ExtractTextPlugin('[name].[contenthash].css'),  // Generate an external css file with a hash in the filename.

    new HtmlWebpackPlugin({
      template: 'client/src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    }),

    new webpack.optimize.DedupePlugin(), // Eliminate duplicate packages in the bundle

    new webpack.optimize.UglifyJsPlugin() // Minify js files
  ],
  module: {
    loaders: [
      {test: /\.js?$/, exclude: /node_modules/, loader: 'babel'},
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'url?public/fonts/name=[name].[ext]'},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&mimetype=application/font-woff&name=public/fonts/[name].[ext]'},
      {test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml&name=public/fonts/[name].[ext]'},
      {test: /\.(jpe?g|png|gif)$/i, loader: 'file?name=public/images/[name].[ext]'},
      {test: /(\.css)$/, loader: ExtractTextPlugin.extract('css?sourceMap')},
    ]
  }
};
