var path = require('path');
var BuildHelper = require('../../../BuildHelper');

module.exports = BuildHelper.configFactory(BuildHelper.currentConfig, {
    filename: 'libf.js',
    entry: path.join(BuildHelper.dirs.shared, 'LibFancyExports.js'),
});
