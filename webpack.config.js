var webpack = require('webpack');

var isDev = process.env.NODE_ENV !== 'production';
var plugins = [];

if (!isDev) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: isDev,
      mangle: false
    })
  );
}

module.exports = {
  entry: './src/index.js',
  devtool: isDev ? 'cheap-module-source-map' : false,
  output: {
    path: __dirname,
    filename: 'compiled.min.js'
  },
  watch: isDev,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: plugins
};
