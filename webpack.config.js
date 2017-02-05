module.exports = {
  entry: "./src/js/index.js",
  devtool: 'cheap-module-source-map',
  output: {
    path: __dirname,
    filename: "compiled.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};