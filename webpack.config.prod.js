var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: [
	  './src/js/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
	  filename: 'js/bundle.js',
	  chunkFilename: 'js/[id].bundle.js',
    publicPath: '/static/'
  },
  plugins: [
	  new webpack.NoErrorsPlugin(),
	  new ExtractTextPlugin('css/app.css', {
		  allChunks: false
	  }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    }, {
		test: /\.css$/,
		loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss')

	},
		{
			test: /\.png$/, loader: "url-loader?limit=1&name=img/[hash].[ext]"
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
