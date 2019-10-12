const merge = require("webpack-merge"); // webpack-merge
const common = require("./webpack.common.js"); // 汎用設定をインポート
const path = require("path");
const webpack = require("webpack");
const WebpackNotifierPlugin = require("webpack-notifier");
const globImporter = require("node-sass-glob-importer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssAssets = require('postcss-assets');
require('dotenv').config();
const PORT = process.env.PORT;

const config = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new webpack.NamedModulesPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/style.css"
    }),
    new WebpackNotifierPlugin({
      title: "Success compiled!",
      contentImage: path.join(__dirname, "dev/js/icons/shibasaki_ko.jpg"),
      alwaysNotify: true
    })
  ],
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true,
          }
        }
      }),
    ],
  },
  devServer: {
    open: true,
    compress: true,
    inline: true,
    hot: false,
    disableHostCheck: true
  }
});

config.module.rules.push({
  test: /\.scss$/,
  exclude: /node_modules/,
  use: [
    "css-hot-loader",
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        sourceMap: true,
        importLoaders: 1,
        url: false
      }
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: true,
        plugins: [
          autoprefixer(),
          cssnano({
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true
                }
              }
            ]
          }),
          postcssAssets({
            loadPaths: ["dev/images/"],
            relative: "./dev/css"
          })
        ]
      }
    },
    {
      loader: "sass-loader",
      options: {
        sourceMap: true,
        importer: globImporter()
      }
    }
  ]
});

module.exports = config;
