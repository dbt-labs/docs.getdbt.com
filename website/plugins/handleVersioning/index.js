const path = require('path');

module.exports = function handleVersioning(context, options) {
  return {
    name: 'docusaurus-handle-versioning-plugin',
    getClientModules() {
      return [path.resolve(__dirname, './event')];
    },

  }
}
