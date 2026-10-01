const path = require("path")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const localNodeModules = path.resolve(__dirname, "../../node_modules")
const docsInternalNodeModulesMarker = `${path.sep}docs-internal${path.sep}website${path.sep}node_modules`

function rewriteDocsInternalPath(filePath) {
  if (!filePath || !filePath.includes(docsInternalNodeModulesMarker)) {
    return filePath
  }
  const idx = filePath.indexOf(docsInternalNodeModulesMarker)
  const suffix = filePath.slice(
    idx + docsInternalNodeModulesMarker.length + 1
  )
  return path.join(localNodeModules, suffix)
}

class ForceLocalNodeModulesPlugin {
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap(
      "ForceLocalNodeModulesPlugin",
      (normalModuleFactory) => {
        normalModuleFactory.hooks.afterResolve.tap(
          "ForceLocalNodeModulesPlugin",
          (data) => {
            if (!data?.createData) {
              return
            }
            data.createData.resource = rewriteDocsInternalPath(
              data.createData.resource
            )
            data.createData.context = rewriteDocsInternalPath(
              data.createData.context
            )
          }
        )
      }
    )
  }
}

// Adds custom configurations to webpack
module.exports = function customWebpackConfigPlugin() {
  return {
    name: "docusaurus-custom-webpack-config-plugin",
    configureWebpack(config, isServer, { currentBundler }) {
      const localThemeCommon = path.join(
        localNodeModules,
        "@docusaurus/theme-common"
      )
      const localPluginContentDocs = path.join(
        localNodeModules,
        "@docusaurus/plugin-content-docs"
      )

      return {
        resolve: {
          modules: [localNodeModules, "node_modules"],
          alias: {
            "@docusaurus/theme-common$": path.join(
              localThemeCommon,
              "lib/index.js"
            ),
            "@docusaurus/theme-common/internal$": path.join(
              localThemeCommon,
              "lib/internal.js"
            ),
            "@docusaurus/plugin-content-docs$": path.join(
              localPluginContentDocs,
              "lib/index.js"
            ),
            "@docusaurus/plugin-content-docs/client$": path.join(
              localPluginContentDocs,
              "lib/client/index.js"
            ),
            "@docusaurus/utils-common$": path.join(
              localNodeModules,
              "@docusaurus/utils-common/lib/index.js"
            ),
          },
          fallback: {
            fs: false,
            path: require.resolve("path-browserify"),
            http: require.resolve("stream-http"),
            tty: require.resolve("tty-browserify"),
          },
        },
        plugins: [
          new ForceLocalNodeModulesPlugin(),
          new currentBundler.instance.DefinePlugin({
            "process.versions.node": JSON.stringify(
              process.versions.node || "0.0.0"
            ),
            // Datadog RUM - injected at build time for client bundle
            "process.env.DD_APP_ID": JSON.stringify(process.env.DD_APP_ID || ""),
            "process.env.DD_CLIENT_TOKEN": JSON.stringify(
              process.env.DD_CLIENT_TOKEN || ""
            ),
            "process.env.DD_SERVICE": JSON.stringify(
              process.env.DD_SERVICE || "docs-getdbt-com"
            ),
            "process.env.DD_ENV": JSON.stringify(
              process.env.DD_ENV || process.env.VERCEL_ENV || "production"
            ),
            "process.env.DD_VERSION": JSON.stringify(
              process.env.VERCEL_GIT_COMMIT_SHA ||
                process.env.VERCEL_GIT_SHA ||
                "unknown"
            ),
            "process.env.DD_SAMPLE_RATE": JSON.stringify(
              process.env.DD_SAMPLE_RATE || "25"
            ),
            "process.env.DD_SESSION_REPLAY_SAMPLE_RATE": JSON.stringify(
              process.env.DD_SESSION_REPLAY_SAMPLE_RATE || "10"
            ),
            // Optimizely
            "process.env.OPTIMIZELY_ID": JSON.stringify(
              process.env.OPTIMIZELY_ID || ""
            ),
          }),
          new NodePolyfillPlugin({}),
        ],
        module: {
          rules: [{ test: /\.py$/, loader: "raw-loader" }],
        },
      }
    },
  }
}
