var path = require('path');
var BuildHelper = require('../../../BuildHelper');

module.exports = BuildHelper.configFactory(BuildHelper.currentConfig, {
    filename: 'overlay-article.js',
    entry: path.join(BuildHelper.dirs.shared, 'ui', 'overlay-article', 'index.js'),
    rules: [
        {
            test: /\.css$/,
            use: "style-loader!css-loader"
        },
    ], // https://github.com/orthes/medium-editor-insert-plugin/wiki/v2.x-Using-with-webpack
    externals: BuildHelper.includeExternals({ jquery: 'jQuery' })
});
