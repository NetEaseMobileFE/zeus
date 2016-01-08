var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client',
    './src/js/index'
  ],
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: 'bundle.js',
    publicPath: '/static/js/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
	  new ExtractTextPlugin('app.css', {
		  allChunks: true
	  })
  ],
  module: {
    loaders: [{
      test: /\.jsx?/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    },
		{
			test: /\.css$/,
			loader: 'style!css!postcss-loader'
		},
		{
			test: /\.png$/, loader: "url-loader?limit=1"
		}]
  },
	postcss: function () {
		return [
			require('autoprefixer'),
			require('postcss-sprites')({
				stylesheetPath: './src/css',
				spritePath    : './src/img/sprite.png'
			})
		];
	}
};
