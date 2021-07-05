var path = require('path');
var BuildHelper = require('../../../../BuildHelper');

module.exports = BuildHelper.configFactory(BuildHelper.currentConfig, {
    path: path.join(__dirname, '..'),
    filename: 'overlay-admin.js',
    entry: path.join(__dirname, 'components', 'Admin.js'),
});
