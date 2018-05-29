const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const webpack = require('webpack');

// const PUBLIC_PATH = '/contacts/';
const PUBLIC_PATH = '/';

module.exports = {
  mode: 'development',
  context: path.resolve('src'),
  entry: {
    app: './index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('dist'),
    publicPath: PUBLIC_PATH
  },
  devServer: {
    open: true
  },
  devtool: 'eval-source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),
    new WebpackPwaManifest({
      name: 'Contacts',
      description:
        'Simple contact manager using HTML, CSS & vanilla JavaScript.',
      background_color: '#2a56c6',
      theme_color: '#2a56c6',
      start_url: '/contacts/',
      display: 'standalone',
      publicPath: '/contacts/',
      icons: [
        {
          src: path.resolve('./src/assets/icon.png'),
          sizes: [96, 128, 192, 256, 384, 512]
        }
      ]
    }),
    new FaviconsWebpackPlugin('./assets/icon.png')
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
