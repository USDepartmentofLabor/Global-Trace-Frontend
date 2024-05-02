import webpack from 'webpack';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import nodeExternals from 'webpack-node-externals';
import { VueLoaderPlugin } from 'vue-loader';

dotenv.config();

const serverConfig = {
  entry: './server/index.js',
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'server.js',
    publicPath: '/',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              logLevel: 'info',
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        ],
      },
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              esModule: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|ico|mp4|mp3|txt|woff|woff2|eot|ttf|otf|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[contenthash][ext]',
        },
      },
    ],
  },
  target: 'node',
  mode: process.env.NODE_ENV,
  node: {
    global: true,
    __filename: true,
    __dirname: true,
  },
  resolve: {
    modules: ['node_modules', 'app'],
    extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    alias: {
      components: path.resolve(__dirname, '../src/components'),
      containers: path.resolve(__dirname, '../src/containers'),
      config: path.resolve(__dirname, '../src/config'),
      api: path.resolve(__dirname, '../src/api'),
      store: path.resolve(__dirname, '../src/store'),
      types: path.resolve(__dirname, '../src/types'),
      styles: path.resolve(__dirname, '../src/styles'),
      pages: path.resolve(__dirname, '../src/pages'),
      i18n: path.resolve(__dirname, '../i18n'),
      utils: path.resolve(__dirname, '../src/utils'),
      assets: path.resolve(__dirname, '../assets'),
      src: path.resolve(__dirname, '../src'),
      modals: path.resolve(__dirname, '../src/modals'),
      enums: path.resolve(__dirname, '../src/enums'),
      directives: path.resolve(__dirname, '../src/directives'),
      middlewares: path.resolve(__dirname, '../src/middlewares'),
    },
    fallback: {
      dgram: false,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
    },
  },
  stats: {
    children: false,
    colors: {
      green: '\u001b[32m',
    },
  },
  externals: [express(), nodeExternals()],
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(process.env.API_URL),
      APP_URL: JSON.stringify(process.env.APP_URL),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      PORT: JSON.stringify(process.env.PORT),
      SSR: JSON.stringify(process.env.SSR),
      SSR_PORT: JSON.stringify(process.env.SSR_PORT),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};

export default serverConfig;
