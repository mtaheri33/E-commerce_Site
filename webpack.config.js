const constants = require('./constants');

let path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),

  webpackConfig = {
    output: {
      path: path.join(__dirname, '/dist'),
      filename: 'index.bundle.js'
    },
    devServer: {
      port: constants.port,
      historyApiFallback: true
    },
    plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /nodeModules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        }
      ]
    }
  }

module.exports = webpackConfig;