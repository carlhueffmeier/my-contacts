const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    open: process.env.OPENBROWSER ? process.env.OPENBROWSER === 'true' : true
  },
  plugins: [
    new WebpackPwaManifest({
      name: 'Contacts',
      description:
        'Simple contact manager using HTML, CSS & vanilla JavaScript.',
      background_color: '#2a56c6',
      theme_color: '#2a56c6',
      start_url: '/',
      display: 'standalone',
      publicPath: '/',
      icons: [
        {
          src: path.resolve('./src/assets/icon.png'),
          sizes: [96, 128, 192, 256, 384, 512]
        }
      ]
    })
  ]
});
