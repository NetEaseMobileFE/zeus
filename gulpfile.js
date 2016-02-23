var fs = require('fs');
var path = require('path');
var posixPath = path.posix;
var exec = require('child_process').exec;

var gulp = require('gulp');
var gutil = require("gulp-util");
var rimraf = require('rimraf');
var vftp = require( 'vinyl-ftp' );
var htmlreplace = require('gulp-html-replace');
var htmlmin = require('gulp-htmlmin');
var imageisux = require('gulp-imageisux');
var imageisuxPoll = require('gulp-imageisux-poll');
var webpackStream = require('webpack-stream');
var fileInsert = require("gulp-file-insert");
var gulpIgnore = require('gulp-ignore');

/**
 * Change to your deploy configs.
 */
var deployConfig = {
	test: { 					// Publish mode. Default: 'test'
		htmlFtp: 'galaxy',		// Ftp name uesed to upload html files. Required
		htmlRoot: 'test',		// Root dir where keep html files. Default: ''
		assetFtp: 'galaxy', 	// Same as htmlFtp. Default: 'img'
		assetRoot: 'test/2',	// Same as htmlRoot
		revision: false,		// If append revision to asset path. Default: true
		withHash: false        // If build "vendor" file with hash. Default: true. Equals to "js/vendor.[chunkhash].js"
	},
	pro: {
		htmlFtp: 'c_m',
		htmlRoot: 'test',
		assetRoot: 'apps/test/hh'
	}
};
var projectName = JSON.parse(fs.readFileSync('package.json', 'utf-8')).name;
var profile = JSON.parse(fs.readFileSync('.profile', 'utf-8'));
var publishMode = gutil.env.p ? 'pro' : 'test';
var publishConfig = global.publish = initPublishConfig(publishMode);
var webpackConfig = require('./webpack.config.prod');
var webpackStats;  // Record webpack build stats

// Set build env. Important!
process.env.NODE_ENV = 'production';

/**
 * Tasks
 */
gulp.task('clean', function(callback) {
	rimraf('dist', function(err) {
		if (err) throw new gutil.PluginError("clean", err);
		callback();
	});
});

// Compile js/css/img by webpack
gulp.task('assets', ['clean'], function() {
	var conn = createConnection(publishConfig.assetFtp);

	return gulp.src('src/js/index.js')
		.pipe(webpackStream(webpackConfig, null, function(err, stats) {
			webpackStats = stats.toJson({
				chunks: true,
				modules: true,
				chunkModules: true,
				reasons: true,
				cached: true,
				cachedAssets: true
			});

			fs.writeFile('./analyse.log', JSON.stringify(webpackStats), null, 2);
		}))
		.pipe(gulp.dest('dist'))
		.pipe(gulpIgnore.exclude(['**/*.map', '**/{img,img/**}', '**/webpackBootstrap.*.js']))
		// .pipe(conn.dest(publishConfig.assetDir));
});

// Replace assets' path in html files
gulp.task('html', ['assets'], function() {
	var apr = publishConfig.assetPathRevised;
	var conn = createConnection(publishConfig.htmlFtp);
	var assetsNames = webpackStats.assetsByChunkName;

	return gulp.src('src/*.html')
		.pipe(htmlreplace({
			'css': apr + 'css/app.css',
			'bundle': apr + 'js/bundle.js',
			'vendor': publishConfig.assetPath + assetsNames.vendor[0]
		}))
		.pipe(fileInsert({
			"/*webpackBootstrap*/": path.join('dist', assetsNames.webpackBootstrap[0])
		}))
		.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
		.pipe(gulp.dest('dist'))
		// .pipe(conn.dest(publishConfig.htmlDir));
});

// Optimize images
gulp.task('isux', function() {
	var dest = '_min';

	rimraf.sync('dist/img/' + dest);
	return gulp.src(['dist/img/*'])
		.pipe(imageisux('/min/', true))
		.pipe(imageisuxPoll(dest));
});

gulp.task('img', ['isux'], function () {
	var conn = createConnection(publishConfig.assetFtp);

	gulp.src(['dist/img/_min/**'], { buffer: false })
		.pipe(conn.dest(publishConfig.assetDir + '/img'));
});

// Start
gulp.task('default', ['html'], function() {
	if (publishMode === 'test') {
	  exec('scp -r -P 16322 dist/* ' + profile.developer + '@223.252.197.245:/home/' + profile.developer + '/' + projectName + '/', function(err){
	    if (err) return cb(err); // return error
			gutil.log('Done!');
			gutil.log('HTML published at ' + gutil.colors.bgCyan.white(publishConfig.htmlPath));
			gutil.log('Assets deployed at ' + gutil.colors.bgCyan.white(publishConfig.assetPathRevised));
	  })
	} else {
		gutil.log('Done!');
		gutil.log('HTML published at ' + gutil.colors.bgCyan.white(publishConfig.htmlPath));
		gutil.log('Assets deployed at ' + gutil.colors.bgCyan.white(publishConfig.assetPathRevised));
	}
});


/**
 * Utils
 */
function initPublishConfig(mode) {
	var dc = deployConfig[mode],
		revision = dc.revision === false ? '' : Date.now() + '',
		hash = dc.withHash !== false,

		assetFtp = profile.ftp[dc.assetFtp || 'img'],
		assetRoot = dc.assetRoot || '',
		assetDir = posixPath.join('/', assetRoot, projectName),
		assetPath = assetFtp.origin + assetDir + '/',
		assetPathRevised = assetFtp.origin + posixPath.join(assetDir, revision, '/'),

		htmlFtp = profile.ftp[dc.htmlFtp],
		htmlRoot = dc.htmlRoot || '',
		htmlDir = posixPath.join('/', htmlRoot, projectName),
		htmlPath = htmlFtp.origin + htmlDir + '/';

	return {
		revision: revision,
		hash: hash,

		assetFtp: assetFtp,
		assetDir: assetDir,
		assetPath: assetPath,
		assetPathRevised: assetPathRevised,

		htmlFtp: htmlFtp,
		htmlDir: htmlDir,
		htmlPath: htmlPath
	};
}

function createConnection(ftpConfig) {
	var options = {
		host: ftpConfig.host,
		port: ftpConfig.port,
		user: ftpConfig.username,
		password: ftpConfig.password,
		parallel: 5
	};

	if ( ftpConfig.secure ) {
		options.secure = true;
		options.secureOptions = {
			requestCert: true,
			rejectUnauthorized: false
		}
	}

	return vftp.create(options);
}