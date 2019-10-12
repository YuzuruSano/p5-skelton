const browserSync = require("browser-sync");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
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
  server: {
    baseDir: "./build",
    middleware: [
      function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      },
      webpackDevMiddlewareInstance,
    ]
  },
  files: [
    {
      /**
       * php & pug
       */
      match: ["./dev/js/**/*.js", "./dev/sass/**/*.scss", "./dev/pug/**/*.pug", "../**/*.php"],
      fn: (event, file) => {
        webpackDevMiddlewareInstance.waitUntilValid(() => {
          server.reload();
        });
      }
    }
  ]
});
