var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
	devtool: 'source-map',
	entry: {
		app: './src/js/index',
		vendor: [
			'react', 'react-dom'
		]
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'js/bundle.js',
		chunkFilename: 'js/[id].bundle.js',
		publicPath: 'http://img4.cache.netease.com/utf8/assets/'
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'js/vendor.bundle.js',
			minChunks: Infinity
		}),
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
		loaders: [
			{
				test: /\.jsx?/,
				loaders: ['babel'],
				include: path.join(__dirname, 'src')
			}, {
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss')
			}, {
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass')
			}, {
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!less')
			}, {
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!stylus')
			}, {
				test: /\.png|jpe?g|gif$/, loader: "url-loader?limit=1&name=img/[hash].[ext]"
			}
		]
	},
	postcss: function() {
		return [
			require('postcss-original-path'),
			require('postcss-assets')({
				loadPaths: ['./src/img/'],
				relative: true
			}),
			require("postcss-cssnext"),
			require('postcss-sprites')({
				stylesheetPath: './src/css',
				spritePath: './src/img/sprite.png',
				outputDimensions: true,
				skipPrefix: true,
				filterBy: function(img) {
					return /\/sp\-[^\/]+\//.test(img.url);
				},
				groupBy: function(img) { // todo
					var match = img.url.match(/\/(sp\-[^\/]+)\//);
					return match ? match[1] : null;
				}
			})
		];
	}
};
