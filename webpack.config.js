'use strict';

const fs = require('fs');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function _path(p) {
  return path.join(__dirname, p);
}

function defineEntry(conf, entry, plugins) {
  entry[conf.name] = `./${conf.name}.entry.js`;

  let data = {};
  if (conf.data) {
    const root = _path(`./src/templates/${conf.name}/${conf.data}.data.json`);
    const rawData = fs.readFileSync(path.resolve(__dirname, root));
    data = JSON.parse(rawData);
  }

  const template = `./templates/${conf.name}/${conf.template}.pug`;
  plugins.push(
    new HtmlWebpackPlugin({
      chunks: [conf.name],
      template: template,
      data: data,
      filename: `${conf.template}.html`
    })
  )
}

function getEntries() {
  const data = fs.readFileSync(_path('./src/entry.json'));
  const { entries } = JSON.parse(data);
  const entry = {};
  const plugins = [];

  entries.forEach(
    (conf) => defineEntry(conf, entry, plugins)
  );

  return { entry, plugins };
}

const { entry, plugins } = getEntries();

module.exports = {
  context: _path('./src/'),

  entry: {
    ...entry
  },

  output: {
    filename: '[name].js',
    path: _path('./dist/')
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'jquery': _path('node_modules/jquery/dist/jquery'),
      'inputmask' : _path('node_modules/jquery.inputmask/dist/inputmask/inputmask'),
      'jquery.inputmask': _path('node_modules/inputmask/dist/jquery.inputmask'),
    },
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
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
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },

      {
        test: /\.pug$/i,
        use: ['pug-loader']
      },

      {
        test: /\.(png|jpg|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: 'assets/images/',
        }
      },

      {
        test: /\.(ttf|eot|otf|woff|woff2|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/fonts/',
        }
      },

      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: (content, loaderContext) => {
                const { resourcePath, rootContext } = loaderContext;
                const relativePath = path.relative(rootContext, resourcePath);
                const pathParts = relativePath.split(path.sep);
                const isCommonBlockStyle = pathParts.includes('common.blocks');
                const isTemplateStyle = pathParts.includes('templates');
                
                if (isCommonBlockStyle) {
                  return `@use '../../styles/shared' as *;\n${content}`;
                }

                if (isTemplateStyle) {
                  return `@use '../../styles/shared' as *;\n${content}`;
                }
                
                return content;
              }
            }
          }
        ],
      },

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
                [
                  '@babel/plugin-transform-runtime',
                ],
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
                [
                  '@babel/plugin-transform-runtime',
                ],
              ]
            }
          }
        ]
      },
    ]
  }
}