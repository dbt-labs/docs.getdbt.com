module.exports = function () {
  return {
    name: 's3-img-proxy',
    configureWebpack(config, isServer) {
      if (isServer || process.env.NODE_ENV !== 'development') return {};
      return {
        devServer: {
          proxy: [{
            context: ['/img'],
            target: 'https://d2z3qofvp275uy.cloudfront.net.',
            changeOrigin: true,
          }],
        },
      };
    },
  };
};
