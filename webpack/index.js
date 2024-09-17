import dotenv from 'dotenv';
import webpackBaseConfig from './base';
import webpackProductionConfig from './production';
import webpackDevConfig from './dev';
import serverConfig from './server';

dotenv.config();

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const DEBUG = process.env.DEBUG === 'true';
const SSR = process.env.SSR === 'true';

const webpackConfig = {
  entry: './src/main.ts',
  output: DEVELOPMENT
    ? webpackDevConfig.output
    : webpackProductionConfig.output,
  module: {
    rules: [
      ...webpackBaseConfig.rules,
      ...(DEVELOPMENT
        ? webpackDevConfig.module
        : webpackProductionConfig.module),
    ],
  },
  optimization: DEVELOPMENT
    ? webpackDevConfig.optimization
    : webpackProductionConfig.optimization,
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.vue', '.json'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    modules: ['node_modules', 'src'],
    alias: webpackBaseConfig.alias,
    fallback: {
      dgram: false,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
    },
  },
  performance: DEVELOPMENT
    ? webpackDevConfig.performance
    : webpackProductionConfig.performance,
  node: {
    global: true,
    __filename: true,
    __dirname: true,
  },
  stats: {
    children: false,
    colors: {
      green: '\u001b[32m',
    },
  },
  plugins: [
    ...webpackBaseConfig.plugins,
    ...(DEVELOPMENT
      ? webpackDevConfig.plugins
      : webpackProductionConfig.plugins),
  ],
};

if (DEBUG) {
  webpackConfig.devtool = 'inline-source-map';
}

if (DEVELOPMENT && !SSR) {
  webpackConfig.devServer = webpackBaseConfig.devServer;
}

export default SSR ? [webpackConfig, serverConfig] : webpackConfig;
