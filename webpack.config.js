const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const pkg = require('./package.json');
const isDev = process.env.NODE_ENV === 'development';

const config = {
  entry: {
    app: ['./src/client/index.jsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    devtoolModuleFilenameTemplate: '/[resource-path]',
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.svg$/,
        use: ['file-loader'],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?modules&importLoaders=1&localIdentName=[path]_[name]_[local]',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: isDev,
                plugins() {
                  return [autoprefixer];
                },
              },
            },
            'sass-loader',
          ],
        }),
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/client/index.html' }),
    new ExtractTextPlugin({
      filename: 'static/css/[name].[chunkhash:8].min.css',
      disable: isDev,
    }),
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
  },
};

if (isDev) {
  config.entry.app.unshift('react-hot-loader/patch');
  config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
  config.devtool = 'cheap-module-source-map';
} else {
  config.output.filename = 'static/js/[name].[hash:8].min.js';
  config.output.chunkFilename = 'static/js/[name].[hash:8].chunk.js';
  config.optimization = {
    splitChunks: {
      cacheGroups: {
        default: {
          chunks: 'initial',
          name: 'app',
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          chunks: 'initial',
          name: 'vendors',
          priority: -10,
          test: /node_modules\/(.*)\.js/,
        },
      },
    },
  };
}

module.exports = config;
