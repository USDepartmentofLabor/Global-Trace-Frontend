import path from 'path';
import webpack from 'webpack';
import dotenv from 'dotenv';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { VueLoaderPlugin } from 'vue-loader';

dotenv.config();

const DEVELOPMENT = process.env.NODE_ENV === 'development';

const baseConfig = {
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
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
    {
      type: 'javascript/auto',
      test: /\.json$/,
      loader: 'json-loader',
    },
    {
      test: /\.(md)$/,
      use: [MiniCssExtractPlugin.loader, 'html', 'highlight', 'markdown'],
    },
  ],
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
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new webpack.ProgressPlugin({ percentBy: 'entries', profile: true }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '../dist'),
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      logging: 'info',
      progress: true,
    },
    devMiddleware: {
      writeToDisk: true,
    },
    webSocketServer: false,
    hot: false,
    port: process.env.PORT || 8001,
    host: '0.0.0.0',
    compress: !DEVELOPMENT,
    allowedHosts: 'all',
    historyApiFallback: true,
  },
};

export default baseConfig;
