const webpack = require('webpack');
module.exports = config => {
  const plugins = [
    new webpack.HotModuleReplacementPlugin({
    }),
  ];
  config.plugins = (config.plugins || []).concat(plugins);
  return config;
};
