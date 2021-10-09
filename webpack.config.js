const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './app/static/index.html',
  filename: 'index.html',
  inject: 'body',
})

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: require.resolve('snapsvg'),
        use: 'imports-loader?this=>window,fix=>module.exports=0',
      },
    ],
  },
  plugins: [HtmlWebpackPluginConfig],
}
