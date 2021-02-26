const fs = require('fs');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getEntry() {
    const entry = {},
          plugins = [],
          data = fs.readFileSync(path.resolve(__dirname, './src/entry.json')),
          { entryPoints } = JSON.parse(data);

    entryPoints.forEach(
        (val) => {
            entry[val.name] = `./${val.name}.entry.js`;
            plugins.push(
                new HtmlWebpackPlugin({
                    chunks: [val.name],
                    template: `./${val.template}.pug`,
                    filename: `${val.template}.html`
                })
            )
        }
    )
    plugins.push(new CleanWebpackPlugin());
    plugins.push(new MiniCssExtractPlugin({
        filename: '[name].css'
    }));

    return {entry, plugins};
}

const {entry, plugins} = getEntry();

console.log("entry, plugins", entry, plugins);

module.exports = {
    context: path.resolve(__dirname, 'src/'),
    entry,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [  
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            { 
                test: /\.pug$/i,
                use: ['pug-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)$/i,
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  outputPath: 'assets/images/'
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
              test: /\.s[ac]ss$/i,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {}
                },
                'css-loader',
                'sass-loader'
              ],
            },
        ]
    }
}