var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var publishConfig = global.publish || {};
var revision = publishConfig.revision ? publishConfig.revision + '/' : '';
var publicPath = publishConfig.assetPath || '/static/';


module.exports = {
	devtool: 'source-map',
	entry: {
		app: './src/js/index',
		vendor: [
			'react', 'react-dom'
		],
		webpackBootstrap: [] // Extract the webpackBootstrap from chunks
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: revision + 'js/bundle.js',
		chunkFilename: revision + 'js/[id].bundle.js',
		publicPath: publicPath
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor', 'webpackBootstrap'],
			filename: 'js/[name].js',
			minChunks: Infinity
		}),
		new ExtractTextPlugin(revision + 'css/app.css', {
			allChunks: false
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
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
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1!postcss')
			}, {
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1!postcss!sass')
			}, {
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1!postcss!less')
			}, {
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1!postcss!stylus')
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
