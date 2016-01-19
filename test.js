'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var fs = require('fs');
var path = require('path');

// Consts
const PLUGIN_NAME = 'gulp-test';

module.exports = function (dest) {
	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			// 返回空文件
			return cb(null, file);
		}

		var filePath = path.resolve(file.base, dest, path.relative(file.base, file.path));
		exist(filePath, function() {
			cb(null, file)
		});
	});
};

function exist(filePath, callback) {
	fs.stat(filePath, function(err) {
		if ( !err ) {
			callback();
		} else {
			setTimeout(function() {
				exist(filePath, callback);
			}, 100)
		}
	})
}