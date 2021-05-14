'use strict';

const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { entries, plugins } = _getEntriesAndPlugins();

module.exports = {
  context: _path('src'),

  entry: {
    ...entries
  },

  output: {
    filename: '[name].js',
    path: _path('dist')
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        common: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },

  resolve: {
    modules: [
      _path('src'),
      'node_modules'
    ],
    alias: {
      'jquery': _path('node_modules/jquery/dist/jquery'),
      'inputmask' : _path('node_modules/jquery.inputmask/dist/inputmask/inputmask'),
      'jquery.inputmask': _path('node_modules/inputmask/dist/jquery.inputmask'),
      'aliasImg': _path('assets/img/'),
    },
    extensions: ['.ts', '.js', '.scss'],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    ...plugins
  ],

  stats: {
    all: false,
    assets: true,
    cachedAssets: true,
    errors: true,
    errorDetails: true,
    hash: true,
    performance: true,
    publicPath: true,
    timings: true,
  },

  module: {
    rules: [
      {
        test: /\.pug$/i,
        use: ['pug-loader']
      },

      {
        test: /\.(png|jpg|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: (url, resourcePath, context) => {
            const relativePath = path.relative(context, resourcePath);

            if (/\\fonts\\/.test(relativePath)) {
              return `assets/fonts/${url}`;
            }

            if (/\\favicon\\/.test(relativePath)) {
              return `assets/favicon/${url}`;
            }

            return `assets/img/${url}`;
          }
        }
      },

      {
        test: /\.(ttf|eot|otf|woff|woff2)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/fonts/'
        }
      },

      {
        test: /\.ico$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '',
        }
      },

      {
        test: /\.json$/,
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '',
            },
          },
        ],
      },

      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: _defineAdditionData,
            }
          }
        ],
      },

      // TODO: Should be reduced to one
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime',
              ]
            }
          }
        ]
      },

      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime',
              ]
            }
          }
        ]
      },
    ]
  }
}

function _getEntriesAndPlugins() {
  const data = fs.readFileSync(_path('src/entries.json'));
  const { entriesSettings } = JSON.parse(data);

  const entries = {};
  const plugins = [];

  entriesSettings.forEach((entrySettings) => {
    _defineEntryAndPlugin(entrySettings, entries, plugins)
  });

  return { entries, plugins };
}

function _defineEntryAndPlugin(entrySettings, entries, plugins) {
  _defineEntry(entrySettings, entries)

  const templatePath = entrySettings.templatePath;
  if (templatePath !== undefined) {
    _definePlugin(entrySettings, plugins);
  }
}

function _defineEntry(entrySettings, entries) {
  const name = entrySettings.entryName;
  entries[name] = `./${name}.entry.js`;
}

function _definePlugin(entrySettings, plugins) {
  const { chunks, outputName, dataPath, templatePath } = entrySettings;
  const data = _extractData(dataPath);
  const template = path.join('./templates', `${templatePath}.pug`);

  plugins.push(
    new HtmlWebpackPlugin({
      data,
      chunks,
      template: template,
      filename: `${outputName}.html`,
    })
  )
}

function _extractData(dataPath) {
  if (dataPath === undefined) {
    return {};
  }

  const rawData = fs.readFileSync(_path(`src/${dataPath}.data.json`));
  return JSON.parse(rawData);
}

function _defineAdditionData(content, loaderContext) {
  const { resourcePath, rootContext } = loaderContext;
  const relativePath = path.relative(rootContext, resourcePath);
  const pathParts = relativePath.split(path.sep);

  const isCommonBlockStyle = pathParts.includes('components');
  const isTemplateStyle = pathParts.includes('templates');
  if (isCommonBlockStyle || isTemplateStyle) {
    return `@use 'styles/_shared' as *;\n${content}`;
  }

  return content;
}

function _path(p) {
  return path.join(__dirname, p);
}
