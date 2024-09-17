import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
// import CompressionPlugin from 'compression-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import MomentLocalesPlugin from 'moment-locales-webpack-plugin';
import PreloadWebpackPlugin from '@vue/preload-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import webpack from 'webpack';
import dotenv from 'dotenv';

dotenv.config();

const webpackConfig = {
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'app.[contenthash].js',
    publicPath: '/',
    // publicPath: `${process.env.APP_URL}`,
    chunkFilename: '[name].[contenthash].chunk.js',
    assetModuleFilename: '[contenthash][ext]',
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|ico|svg)$/i,
        type: 'asset',
        generator: {
          filename: '[contenthash][ext]',
        },
      },
      {
        test: /\.(mp3|txt|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[contenthash][ext]',
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            comparisons: false,
          },
          parse: {},
          mangle: true,
          output: {
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
      }),
    ],
    nodeEnv: 'production',
    sideEffects: true,
    concatenateModules: true,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 10,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module
              .identifier()
              .split('/')
              .reduceRight((item) => item);
            return `pkg.${packageName.replace('.js', '').replace('@', '')}`;
          },
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
    new MomentLocalesPlugin({
      localesToKeep: ['es-us'],
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 15,
    }),
    new CssMinimizerPlugin(),
    new ImageMinimizerPlugin({
      deleteOriginalAssets: true,
      minimizerOptions: {
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['mozjpeg', { quality: 80 }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 7 }],
          ['pngquant', { quality: [0.6, 0.8] }],
        ],
      },
    }),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, '../public/index.html'),
      template: path.join(__dirname, '../index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.ids.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.(woff|ttf|eot)$/.test(entry)) return 'font';
        if (/\.(png|svg|ico)$/.test(entry)) return 'image';
        return 'script';
      },
      fileBlacklist: [/\.txt/, /\.map/, /\.mp3/],
    }),
    new MiniCssExtractPlugin({
      filename: 'app.[contenthash].css',
      chunkFilename: '[name].[contenthash].chunk.css',
      ignoreOrder: true,
    }),
    // new CompressionPlugin({
    //   filename: '[file]',
    //   algorithm: 'gzip',
    //   test: /\.js$|\.css$/,
    //   deleteOriginalAssets: true,
    //   minRatio: 0.8,
    // }),
    new WebpackManifestPlugin(),
  ],
  performance: {
    assetFilter: (assetFilename) =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
  },
};

export default webpackConfig;
