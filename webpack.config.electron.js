// @ts-check
require('dotenv').config()
const webpack = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

/**
 * @type {webpack.Configuration}
 */
module.exports = {
  mode: 'development',
  entry: {
    main: './src/electron/main.ts'
  },
  target: 'electron-main',
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
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __WP_RENDERER_HOST__:
        process.env.STAGE === 'build'
          ? JSON.stringify('build/index.html')
          : JSON.stringify('http://localhost:8080')
    })
  ]
}
