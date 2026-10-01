const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

// Adds custom configurations to webpack
module.exports = function customWebpackConfigPlugin() {
  return {
    name: "docusaurus-custom-webpack-config-plugin",
    configureWebpack(config, isServer, { currentBundler }) {
      return {
        resolve: {
          fallback: {
            fs: false,
            path: require.resolve("path-browserify"),
            http: require.resolve("stream-http"),
            tty: require.resolve("tty-browserify"),
          },
        },
        plugins: [
          new currentBundler.instance.DefinePlugin({
            "process.versions.node": JSON.stringify(
              process.versions.node || "0.0.0"
            ),
            // Datadog RUM - injected at build time for client bundle
            "process.env.DD_APP_ID": JSON.stringify(process.env.DD_APP_ID || ""),
            "process.env.DD_CLIENT_TOKEN": JSON.stringify(process.env.DD_CLIENT_TOKEN || ""),
            "process.env.DD_SERVICE": JSON.stringify(process.env.DD_SERVICE || "docs-getdbt-com"),
            "process.env.DD_ENV": JSON.stringify(process.env.DD_ENV || process.env.VERCEL_ENV || "production"),
            "process.env.DD_VERSION": JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GIT_SHA || "unknown"),
            "process.env.DD_SAMPLE_RATE": JSON.stringify(process.env.DD_SAMPLE_RATE || "25"),
            "process.env.DD_SESSION_REPLAY_SAMPLE_RATE": JSON.stringify(process.env.DD_SESSION_REPLAY_SAMPLE_RATE || "10"),
            // Optimizely
            "process.env.OPTIMIZELY_ID": JSON.stringify(process.env.OPTIMIZELY_ID || ""),
          }),
          new NodePolyfillPlugin({}),
        ],
        module: {
          rules: [{ test: /\.py$/, loader: "raw-loader" }],
        },
      };
    },
  };
}
