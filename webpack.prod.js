const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: '/contacts/'
  },
  devtool: 'source-map',
  plugins: [
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
    })
  ]
});
