var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev'),
    multer = require('multer'),
    MulterImpl = require('./src-server/multerImpl');

var app = express();
var compiler = webpack(config);

//app.use('/static', express.static(__dirname + '/dist'));

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './src/index.html'));
});

app.post('/uploadHandler',MulterImpl.init({}).array('file'), function (req, res) {
    // This block is only relevant to users
    // interested in custom parameters - you
    // can delete/ignore it as you wish
    var file = req.files[0];
    if (req.body) {
        console.dir(file.path+'.'+file.mimetype.split('/')[1]);
    }
    // End Params Block
    res.json({
        code:1,
        data:file.path+'.'+file.mimetype.split('/')[1]
    });
});

app.listen(3000, 'localhost', function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:3000');
});
