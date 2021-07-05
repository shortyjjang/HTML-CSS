var path = require('path');
var BuildHelper = require('../../../BuildHelper');

// See https://github.com/orthes/medium-editor-insert-plugin/wiki/v2.x-Using-with-webpack
module.exports = BuildHelper.configFactory(BuildHelper.currentConfig, {
    filename: 'article-admin.js',
    entry: path.join(BuildHelper.dirs.shared, 'ui', 'article-admin', 'Admin.js'),
    rules: [
        {
            test: require.resolve("blueimp-file-upload/js/jquery.fileupload.js"),
            loader: "imports-loader?define=>false&exports=>false"
        },
    ],
    externals: BuildHelper.includeExternals({ jquery: 'jQuery' })
});
