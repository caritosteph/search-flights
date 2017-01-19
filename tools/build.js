/* eslint-disable no-console */
import webpack from 'webpack';
import config from '../webpack.config.prod';

process.env.NODE_ENV = 'production';

webpack(config).run((error) => {
  if (error) {
    return 1;
  }
  return 0;
});
