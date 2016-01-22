var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// Init configs
var publishConfig = global.publish || {};
var revision = publishConfig.revision ? publishConfig.revision + '/' : '';
var publicPath = publishConfig.assetPath || '/static/';


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
		filename: revision + 'js/bundle.js',
		chunkFilename: revision + 'js/[id].bundle.js',
		publicPath: publicPath
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: revision + 'js/vendor.bundle.js',
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
				include: path.join(__dirname, 'src/js')
			}, {
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1!postcss'),
				include: path.join(__dirname, 'src/css')
			}, {
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1!postcss!sass'),
				include: path.join(__dirname, 'src/css')
			}, {
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1!postcss!less'),
				include: path.join(__dirname, 'src/css')
			}, {
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1!postcss!stylus'),
				include: path.join(__dirname, 'src/css')
			}, {
				test: /\.png|jpe?g|gif$/,
				loader: "url-loader?limit=1&name=img/[hash].[ext]",
				include: path.join(__dirname, 'src/img')
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
		alias: {
			js: path.join(__dirname, "src/js")
		}
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
					return /\/sp\-/.test(img.url);
				},
				groupBy: function(img) {
					var match = img.url.match(/\/(sp\-[^\/]+)\//);
					return match ? match[1] : null;
				}
			})
		];
	}
};
