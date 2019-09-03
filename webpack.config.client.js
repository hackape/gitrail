// @ts-check
require('dotenv').config()
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

/**
 * @type {webpack.Configuration}
 */
module.exports = {
  entry: {
    renderer: './src/client/index.ts'
  },
  target: 'electron-renderer',
  output: {
    path: __dirname + '/build'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // @ts-ignore
    plugins: [new TsconfigPathsPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                module: 'esnext'
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: ['url-loader']
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: './src/client/index.html'
    }),
    new CopyWebpackPlugin([{ from: __dirname + '/public', to: 'public' }])
  ],
  devServer: {
    historyApiFallback: true,
    port: 8080
  }
}
