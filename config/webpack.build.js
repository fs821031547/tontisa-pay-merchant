const webpack = require('webpack');

module.exports = config => {
  const plugins = [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ];
  config.plugins = (config.plugins || []).concat(plugins);
  return config;
};
