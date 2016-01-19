var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var gutil = require("gulp-util");
var vftp = require( 'vinyl-ftp' );
var htmlreplace = require('gulp-html-replace');
var imageisux = require('gulp-imageisux');
var imageisuxPoll = require('./test');
var webpack = require('webpack');

// Configs
var deployConfig = {
	test: {
		ftp: 't_c',
		assetRootPath: 'test/',
		htmlRootPath: 'test/'
	},
	pro: {
		ftp: 'c_m',
		assetRootPath: '3g',
		htmlRootPath: 'apps/'
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
	exec('npm run clean', function(err, stdout) {
		if (err) throw new gutil.PluginError("clean", err);
		gutil.log(stdout);
		callback();
	});
});

gulp.task('analyse', function(callback) {
	exec('node analyse', function(err, stdout) {
		if (err) throw new gutil.PluginError("analyse", err);
		gutil.log(stdout);
		callback();
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
	var fullpath = publishConfig.assetFullPathWithVersion;

	return gulp.src('./app/index.html')
		.pipe(htmlreplace({
			'css': fullpath + '/css/app.css',
			'js': fullpath + '/js/bundle.js',
			'vendor': fullpath + '/js/vendor.bundle.js'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('img', function() {
	return gulp.src('dist/img/*')
		.pipe(imageisux('_min', false))
		.pipe(imageisuxPoll('_min'));
});

gulp.task('upload',  function () {
	var conn = createConnection(profile.ftp.img);
	var version = publishConfig.version;

	gulp.src(['dist/' + version, '!dist/js/**/*.map'], { buffer: false, base: 'dist' })
		.pipe(conn.dest(publishConfig.assetPath));
});

gulp.task('uploadImg', ['img'], function () {
	var conn = createConnection(profile.ftp.img);

	gulp.src(['dist/img/_min/**'], { buffer: false })
		.pipe(conn.dest(publishConfig.assetPath + '/img' ));
});

gulp.task('uploadHtml', function () {
	var conn = createConnection(publishConfig.ftp);

	gulp.src(['dist/*.html'], { buffer: false })
		.pipe(conn.dest(publishConfig.htmlPath));
});

gulp.task('default', ['upload'], function() {
	gutil.log('Done!');
});



// Utils
function initPublishConfig(mode) {
	var dc = deployConfig[mode],
		version = mode == 'test' ? '' : Date.now() + '/',
		assetRootPath = dc.assetRootPath || '',
		ftpName = dc.ftp,
		ftpConfig = profile.ftp[ftpName];

	return {
		ftp: ftpConfig,
		version: version,
		assetPath: assetRootPath + '/' + projectName,
		assetFullPath: ftpConfig.origin + '/' + projectName + '/',
		assetFullPathWithVersion: ftpConfig.origin + '/' + projectName + '/' + version,
		htmlPath: dc.htmlRootPath + '/' + projectName
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