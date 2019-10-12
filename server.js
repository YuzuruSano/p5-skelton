const browserSync = require("browser-sync");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require("./webpack.dev");
const bundler = webpack(webpackConfig);
require('dotenv').config();

const webpackDevMiddlewareInstance = webpackDevMiddleware(bundler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true
  }
});

const server = browserSync({
  port: process.env.PORT,
  ghostMode: false,
  socket: {
    domain: `localhost:${process.env.PORT}`
  },
  server: {
    baseDir: "build",
    middleware: [
      function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      },
      webpackDevMiddlewareInstance,
      webpackHotMiddleware(bundler)
    ]
  },
  files: [
    {
      /**
       * php & pug
       */
      match: ["./dev/pug/**/*.pug", "../**/*.php"],
      fn: (event, file) => {
        webpackDevMiddlewareInstance.waitUntilValid(() => {
          server.reload();
        });
      }
    }
  ]
});
