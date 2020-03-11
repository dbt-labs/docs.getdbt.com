module.exports = function(context, options) {
  return {
    name: 'docusaurus-svg-loader',
    configureWebpack(config, isServer) {
      return {
        module: {
          rules: [
            {
              test: /\.svg/,
              loader: 'svg-inline-loader'
            },
          ],
        },
      };
    },
  };
};
