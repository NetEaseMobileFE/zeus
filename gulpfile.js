var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var gutil = require("gulp-util");
var vftp = require( 'vinyl-ftp' );
var htmlreplace = require('gulp-html-replace');
var imageisux = require('gulp-imageisux');
var webpack = require('webpack');

var webpackConfig = require('./webpack.config.prod');
var projectName = JSON.parse(fs.readFileSync('package.json', 'utf-8')).name;
var profile = JSON.parse(fs.readFileSync('.profile', 'utf-8'));
var version = Date.now();

var deployConfig = {
	dev: {

	},
	test: {
		assetPath: projectName,

	},
	pro: {

	}
};

var assetOrigin = 'http://img4.cache.netease.com';
var assetPath = '/utf8/3g/witcher';
var assetFullPath = assetOrigin + assetPath;
var assetFullPathWithVersion = assetOrigin + assetPath + '/' + version;
var uploadConfig = {
	host: '61.135.251.132',
	port: 16321,
	user: ftppass.pro.username,
	password: ftppass.pro.password,
	parallel: 5,
	log: gutil.log,
	secure: true,
	secureOptions: {
		requestCert: true,  //请求证书
		rejectUnauthorized: false   //拒绝未经授权
	}
};

var createConnection = function(ftpConfig) {
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
};




gulp.task('clean', function(callback) {
	exec('npm run clean', function(err, stdout) {
		if (err) throw new gutil.PluginError("clean", err);
		gutil.log(stdout);
		callback();
	});
});

gulp.task('webpack', ['clean'], function(callback) {
	webpackConfig.output.publicPath = assetFullPathWithVersion;
	webpack(webpackConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString());
		callback();
	})
});

gulp.task('html', ['clean'], function() {
	return gulp.src('./app/index.html')
		.pipe(htmlreplace({
			'css': assetFullPathWithVersion + '/css/app.css',
			'js': assetFullPathWithVersion + '/js/bundle.js',
			'vendor': assetFullPathWithVersion + '/js/vendor.bundle.js'
		}))
		.pipe(gulp.dest(webpackConfig.output.path));
});

gulp.task('img', function() {
	gulp.src(['app/img/**', '!app/img/{base64,base64/**}', '!app/img/{sp-*,sp-*/**}'])
		.pipe(imageisux('../../dist/img/', false));

	gulp.src(['app/img/sp-*.png'])
		.pipe(imageisux('../../dist/img/', false));
});

gulp.task('upload', ['html', 'webpack'],  function () {
	var conn = vftp.create(uploadConfig);

	gulp.src(['dist/**', '!dist/*.html', '!dist/js/**/*.map'], { buffer: false })
		.pipe(conn.dest(assetPath + '/' + version));
});

gulp.task('uploadImg', function () {
	var conn = vftp.create(uploadConfig);

	gulp.src(['dist/img/**'], { buffer: false })
		.pipe(conn.dest(assetPath + '/img'));
});

gulp.task('test_js', ['clean'], function(callback){
  var config = require('./webpack.config.test');
  webpack(config, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString());
		callback();
	})
})

gulp.task('uploadHtml', function () {
	var conn = vftp.create({
		host: '220.181.29.249',
		port: 16321,
		user: 'wangjun2012',
		password: 'wangjun2012',
		parallel: 5,
		log: gutil.log
	});

	gulp.src(['dist/*.html'], { buffer: false })
		.pipe(conn.dest('/witcher'));
});

gulp.task('test',['f2e'],  function(cb){
	var prefix = 'http://f2e.developer.163.com/' + developer + '/witcher/'
  return gulp.src('./app/index.html')
    .pipe(htmlreplace({
      'css': prefix + 'css/app.css',
      'js': prefix + 'js/bundle.js',
      'vendor': prefix + 'js/vendor.bundle.js'
    }))
    .pipe(gulp.dest('./dist/'))
})
gulp.task('f2e', ['css', 'test_js'], function(cb){
	exec('scp -r -P 16322 dist/* ' + developer + '@223.252.197.245:/home/' + developer + '/' + package.name + '/', function(err){
    if (err) return cb(err); // return error
    cb();
  })
})
gulp.task('default', ['upload'], function() {
	gutil.log('Done!');
});