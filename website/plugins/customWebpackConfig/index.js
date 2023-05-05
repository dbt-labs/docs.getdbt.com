const webpack = require('webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

// Adds custom configurations to webpack
module.exports = function customWebpackConfigPlugin() {
  return {
    name: 'docusaurus-custom-webpack-config-plugin',
    configureWebpack() {   
      return {        
        resolve: {     
          fallback: {
            "fs": false,
            "path": require.resolve("path-browserify"),
            "http": require.resolve("stream-http"),
            "tty": require.resolve("tty-browserify"),
          }
        },
        plugins: [
          new webpack.DefinePlugin({
            'process.versions.node': JSON.stringify(
              process.versions.node || '0.0.0',
            ),
          }),
          new NodePolyfillPlugin({}),
        ],
        module: {
          rules: [
            { test: /\.py$/, loader: 'raw-loader' }
          ]
        }
      }
    }
  }
}
