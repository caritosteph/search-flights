import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack.config.dev'; // dev environment

const bundler = webpack(config);

browserSync({
  port: 3000,
  ui: {
    port: 3001
  },
  server: {
    baseDir: 'src',

    middleware: [
      webpackDevMiddleware(bundler, {
        // Dev middleware can't access config, so we provide publicPath
        publicPath: config.output.publicPath,

        //only errors are displayed to the console.
        noInfo: false,
        quiet: false,
        stats: {
          assets: false,
          colors: true,
          version: false,
          hash: false,
          timings: false,
          chunks: false,
          chunkModules: false
        },
      }),
      webpackHotMiddleware(bundler)
    ]
  },
  // Watch html files
  files: [
    'src/*.html'
  ]
});
