import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const webpackConfig = {
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[contenthash].js',
    hotUpdateChunkFilename: 'hot/hot-update.[name].[fullhash].js',
    hotUpdateMainFilename: 'hot/hot-update.[fullhash].json',
    publicPath: '/',
    chunkFilename: '[contenthash].chunk.js',
    assetModuleFilename: '[contenthash][ext]',
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|ico|mp4|mp3|txt|woff|woff2|eot|ttf|otf|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[contenthash][ext]',
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, '../dist/index.html'),
      template: path.join(__dirname, '../index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[contenthash].css',
      chunkFilename: '[contenthash].css',
      ignoreOrder: true,
    }),
  ],
  performance: { hints: false },
};

export default webpackConfig;
