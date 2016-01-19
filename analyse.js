console.log('Building...');

var fs = require('fs');
var exec = require('child_process').exec;
var logStream = fs.createWriteStream('./analyse.log', {flags: 'a'});
var ls = exec('set NODE_ENV=production && webpack --config webpack.config.prod.js --json');

ls.stdout.pipe(logStream);
ls.stderr.pipe(logStream);

ls.on('close', function () {
	console.log('Done. \nGo to http://webpack.github.io/analyse/ to analyse.');
});

