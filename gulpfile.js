var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var posixPath = path.posix;

var gulp = require('gulp');
var gutil = require("gulp-util");
var rimraf = require('rimraf');
var vftp = require( 'vinyl-ftp' );
var htmlreplace = require('gulp-html-replace');
var imageisux = require('gulp-imageisux');
var imageisuxPoll = require('./test');
var webpack = require('webpack');

// Configs
var deployConfig = {
	test: {
		htmlFtp: 't_c',
		htmlRoot: 'test',
		assetRoot: 'test'
	},
	pro: {
		htmlFtp: 'c_m',
		htmlRoot: 'apps',
		assetRoot: '3g'
	}
};

var projectName = JSON.parse(fs.readFileSync('package.json', 'utf-8')).name;
var profile = JSON.parse(fs.readFileSync('.profile', 'utf-8'));
var publishMode = gutil.env.t || 'test';
var publishConfig = global.publish = initPublishConfig(publishMode);
var webpackConfig = require('./webpack.config.prod');

process.env.NODE_ENV = 'production'; // 设定编译环境

// Tasks
gulp.task('clean', function(callback) {
	rimraf('dist', function(err) {
		if (err) throw new gutil.PluginError("clean", err);
		callback();
	});
});

gulp.task('analyse', function(callback) { // todo
	rimraf('analyse.log', function(err) {
		if (err) throw new gutil.PluginError("analyse", err);
		exec('node analyse', function(err, stdout) {
			if (err) throw new gutil.PluginError("analyse", err);
			gutil.log(stdout);
			callback();
		});
	});
});

gulp.task('webpack', ['clean'], function(callback) {
	webpack(webpackConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString());
		callback();
	})
});

gulp.task('html', ['clean'], function() {
	var apr = publishConfig.assetPathRevised;

	return gulp.src('./src/*.html')
		.pipe(htmlreplace({
			'css': apr + 'css/app.css',
			'js': apr + 'js/bundle.js',
			'vendor': apr + 'js/vendor.bundle.js'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('img', function() {
	var dest = '_min';

	return gulp.src('dist/img/*')
		.pipe(imageisux(dest, false))
		.pipe(imageisuxPoll(dest));
});

gulp.task('upload',  function () {
	var conn = createConnection(publishConfig.assetFtp);

	gulp.src(['dist/' + publishConfig.version, '!dist/js/**/*.map'], { buffer: false, base: 'dist' })
		.pipe(conn.dest(publishConfig.assetDir));
});

gulp.task('uploadImg', ['img'], function () {
	var conn = createConnection(publishConfig.assetFtp);

	gulp.src(['dist/img/_min/**'], { buffer: false })
		.pipe(conn.dest(publishConfig.assetDir + '/img'));
});

gulp.task('uploadHtml', function () {
	var conn = createConnection(publishConfig.htmlFtp);

	gulp.src(['dist/*.html'], { buffer: false })
		.pipe(conn.dest(publishConfig.htmlDir));
});

gulp.task('default', ['upload'], function() {
	gutil.log('Done!');
});



// Utils
function initPublishConfig(mode) {
	var dc = deployConfig[mode],
		version = mode == 'test' ? '' : Date.now() + '/',

		assetFtp = profile.ftp.img,
		assetRoot = dc.assetRoot || '',
		assetDir = posixPath.join('/', assetRoot, projectName),
		assetPath = assetFtp.origin + assetDir + '/',
		assetPathRevised = assetPath + version,

		htmlFtp = dc.htmlFtp,
		htmlRoot = dc.htmlRoot || '',
		htmlDir = posixPath.join('/', htmlRoot, projectName),
		htmlPath = htmlFtp.origin + htmlDir + '/';


	return {
		version: version,

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
		parallel: 5,
		log: gutil.log
	};

	if ( ftpConfig.secure ) {
		options.secure = true;
		options.secureOptions = {
			requestCert: true,  //请求证书
			rejectUnauthorized: false   //拒绝未经授权
		}
	}

	return vftp.create(options);
}