const path = require('path');
const glob = require('glob');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
// const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');


module.exports = {
  entry: {
    'bundle.js': glob.sync('build/static/?(js|css)/main.*.?(js|css)').map(f => path.resolve(__dirname, f)),
  },
  output: {
    filename: 'dist/bundle.min.js',
    publicPath: `${__dirname}`,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'dist/index.html',
      template: 'public/index.html',
      inlineSource: '.(js|css)$',
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: 'bundle',
      preload: /\.js$/,
    }),
  ],
};
