var path = require('path');
var BuildHelper = require('../../../BuildHelper');

module.exports = BuildHelper.configFactory(BuildHelper.currentConfig, {
    filename: 'shared-deps.js',
    entry: path.join(__dirname, '..', 'SharedDeps.js'),
}, (conf) => {
    delete conf.externals;
    return conf;
});
