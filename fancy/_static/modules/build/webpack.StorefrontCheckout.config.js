var path = require('path');
var BuildHelper = require('../../../BuildHelper');

module.exports = BuildHelper.configFactory(BuildHelper.currentConfig, {
    filename: 'storefront-checkout.js',
    entry: path.join(BuildHelper.dirs.shared, 'ui', 'storefront-checkout', 'index.js'),
    rules: [
        {
            test: /\.css$/,
            use: "style-loader!css-loader"
        },
    ],
    externals: BuildHelper.includeExternals({ jquery: 'jQuery' })
});
