const fs = require('fs');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
function defineEntry(conf, entry, plugins) {
    entry[conf.name] = `./${conf.name}.entry.js`;

    let data = {};
    if (conf.data) {
        const root = path.resolve(__dirname,`./src/templates/${conf.name}/${conf.data}.data.json`);
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
    const data = fs.readFileSync(path.resolve(__dirname, './src/entry.json'));
    const {entries} = JSON.parse(data);
    const entry = {};
    const plugins = [];

    entries.forEach(
        (conf) => defineEntry(conf, entry, plugins)
    );

    plugins.push(new CleanWebpackPlugin());
    plugins.push(new MiniCssExtractPlugin({filename: '[name].css'}));

    return {entry, plugins};
}

const {entry, plugins} = getEntries();

module.exports = {
    context: path.resolve(__dirname, './src/'),
    entry: entry,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist/')
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: plugins,
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
                            ],
                            plugins: [
                              '@babel/plugin-proposal-class-properties'
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
                            ],
                            plugins: [
                              '@babel/plugin-proposal-class-properties'
                            ]
                        },
                    }
                ]
            },
        ]
    }
}