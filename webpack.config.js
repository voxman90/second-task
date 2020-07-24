const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    context: path.resolve(__dirname, 'src/'),
    entry: './component.js',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HTMLWebpackPlugin({
          template: './Cards.pug',
          filename: 'Cards.html'
        }),
        new HTMLWebpackPlugin({
          template: './Landing page.pug',
          filename: 'Landing page.html'
        }),
        new HTMLWebpackPlugin({
          template: './Form Elements.pug',
          filename: 'Form Elements.html'
        }),
        new HTMLWebpackPlugin({
          template: './Colors and Type.pug',
          filename: 'Colors and Type.html'
        }),
        new HTMLWebpackPlugin({
          template: './Testing ground.pug',
          filename: 'Testing ground.html'
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'style.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [  
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {}   /* use: ['style-loader', 'css-loader'] */
                    }, 
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