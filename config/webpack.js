const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

const build = require('./webpack.build.js');
const serve = require('./webpack.serve.js');

const config = {
  assetsPublicPath: '/',
};

const devConfig = {
  proxyTable: {
    '/api': 'http://localhost:7001',
  },
  host: '192.168.110.232',
  port: 8080,
  autoOpenBrowser: false,
  poll: false,
  useEslint: true,
  showEslintErrorsInOverlay: false,
  extract: false,
  // devtool: '#eval-source-map',
  devtool: '#source-map',
};

const buildConfig = {
  useEslint: true,
  extract: true,
  devtool: '#source-map',
};

if (process.env.NODE_ENV === 'production') {
  Object.assign(config, buildConfig);
} else {
  Object.assign(config, devConfig);
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './source/main.js',
  },
  output: {
    path: resolve('./app/public'),
    publicPath: config.assetsPublicPath,
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[hash:8].js',
  },
  module: {
    rules: [
      ...(config.useEslint ? [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [ resolve('source') ],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: !config.showEslintErrorsInOverlay,
        },
      }] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: cssLoaders(),
          transformToRequire: {
            video: 'src',
            source: 'src',
            img: 'src',
            image: 'xlink:href',
          },
          extractCSS: config.extract,
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: path.posix.join('img/[name].[hash:8].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: path.posix.join('img/[name].[hash:8].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: path.posix.join('img/[name].[hash:8].[ext]'),
        },
      },
      ...styleLoaders(),
    ],
  },
  resolve: {
    extensions: [ '.js', '.vue', '.json' ],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('source'),
    },
  },
  devServer: {
    historyApiFallback: true,
    noInfo: false,
    overlay: true,
    clientLogLevel: 'warning',
    hot: true, // 与 --hot 参数一起用app运行时就会出错
    host: process.env.HOST || config.host,
    port: process.env.PORT || config.port,
    open: config.autoOpenBrowser,
    publicPath: config.assetsPublicPath,
    proxy: config.proxyTable,
    quiet: true, // true necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.poll,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${process.env.NODE_ENV}'`,
      },
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'extends',
      minChunks(module) {
        return module.resource &&
          (/source(\\|\/)extends/.test(module.resource) ||
            /node_modules(\\|\/)axios/.test(module.resource) ||
            /node_modules(\\|\/)echarts/.test(module.resource) ||
            /node_modules(\\|\/)element-ui/.test(module.resource));
      },
      chunks: [ 'app' ],
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks(module, count) {
        return (
          module.resource && count >= 1 &&
          module.resource.indexOf('node_modules') >= 0 &&
          (!(/source(\\|\/)extends/.test(module.resource))) &&
          (!(/node_modules(\\|\/)axios/.test(module.resource))) &&
          (!(/node_modules(\\|\/)echarts/.test(module.resource))) &&
          (!(/node_modules(\\|\/)element-ui/.test(module.resource)))
        );
      },
      chunks: [ 'app' ],
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'source/index.html',
      inject: true,
      chunksSortMode: 'manual',
      chunks: [
        'manifest', 'common',
        'extends', 'app',
      ],
    }),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [ `Your application is running here: http://${config.host}:${config.port}` ],
      },
    }),
  ],
  performance: {
    hints: false,
  },
  devtool: config.devtool,
};

if (config.extract) {
  module.exports.plugins.push(new ExtractTextPlugin({
    filename: config.assetsPublicPath + '[name].[contenthash:8].css',
    // set the following option to `true` if you want to extract CSS from
    // codesplit chunks into this main css file as well.
    // This will result in *all* of your app's CSS being loaded upfront.
    allChunks: false,
  }),
  new OptimizeCSSPlugin({
    cssProcessorOptions: { safe: true, map: { inline: false } },
  }));
}

if (process.env.NODE_ENV === 'production') {
  module.exports = build(module.exports);
} else {
  module.exports = serve(module.exports);
}


function cssLoaders() {
  const loadersObj = {
    css: genLoaders(),
    postcss: genLoaders(),
    stylus: genLoaders('stylus'),
    styl: genLoaders('stylus'),
  };
  function genLoaders(loader, loaderOptions) {
    const loaders = [
      {
        loader: 'css-loader',
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
        },
      },
    ];
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: loaderOptions,
      });
    }
    if (config.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
      });
    }
    return [ 'vue-style-loader' ].concat(loaders);

  }
  return loadersObj;
}

function styleLoaders() {
  const output = [];
  const loaders = cssLoaders();
  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader,
    });
  }
  return output;
}

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
