
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const webpackConfig = {
  plugins: [
    new webpack.DefinePlugin({
      'process.versions.node': JSON.stringify(
        process.versions.node || '0.0.0',
      ),
    }),
    new NodePolyfillPlugin({}),
  ],
};

module.exports = function(context, options) {
  return {
    name: "webpack5-polyfill-fix",
    configureWebpack(config, isServer, utils) {
      return webpackConfig;
    }
  };
};
