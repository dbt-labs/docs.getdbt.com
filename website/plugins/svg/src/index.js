module.exports = function() {
  return {
    name: 'docusaurus-svg-loader',
    configureWebpack() {
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
