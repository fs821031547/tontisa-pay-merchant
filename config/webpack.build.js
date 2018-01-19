const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

module.exports = config => {
  const plugins = [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: config.sourceMap,
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new CleanWebpackPlugin([ '**/*.*' ], {
      root: path.resolve(__dirname, '../app/public'),
      verbose: true,
    }),
  ];
  config.plugins = (config.plugins || []).concat(plugins);
  return config;
};
