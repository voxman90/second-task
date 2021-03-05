const fs = require('fs');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function configureEntry(conf, entry, plugins) {
    entry[conf.name] = `./${conf.name}.entry.js`;

    plugins.push(
        new HtmlWebpackPlugin({
            chunks: [conf.name],
            template: `./${conf.template}.pug`,
            filename: `${conf.template}.html`
        })
    )
}

function getEntries() {
    const entry = {};
    const plugins = [];
    const data = fs.readFileSync(path.resolve(__dirname, './src/entry.json'));
    const {entries} = JSON.parse(data);

    entries.forEach(
        (conf) => configureEntry(conf, entry, plugins)
    );

    plugins.push(new CleanWebpackPlugin());

    plugins.push(new MiniCssExtractPlugin({
        filename: '[name].css'
    }));

    return {entry, plugins};
}

const {entry, plugins} = getEntries();

module.exports = {
    context: path.resolve(__dirname, 'src/'),
    entry,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
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
            {   
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ]
                        },
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
                                '@babel/preset-typescript'
                            ]
                        },
                    }
                ]
            },
        ]
    }
}