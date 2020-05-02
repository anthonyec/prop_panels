const path = require('path');

const ConfigWebpackPlugin = require('config-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'eval-cheap-source-map',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].[contentHash:5].chunk.js'
  },
  optimization: {
    namedModules: true,
    namedChunks: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin(['./assets']),
    new HtmlWebpackPlugin({
      title: '',
      filename: 'index.html',
      template: './src/index.ejs',
      excludeChunks: []
    }),
    new MiniCssExtractPlugin({
      filename: 'main.[contentHash:5].css',
      allChunks: true
    }),
    new ConfigWebpackPlugin()
  ]
};
