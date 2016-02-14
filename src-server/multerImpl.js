function MulterImpl() {
    var defaultDest = './src-server/';

    this.init = function (config) {
        var multer = require('multer');
        var uploadDir = !config.uplodaDir ? defaultDest : config.uplodaDir;

        var options = {
            dest: uploadDir,
            //rename: function (fieldname, filename) {
            //    return filename + Date.now();
            //},
            onFileUploadStart: function (file) {
                console.log(file.originalname + ' is starting ...');
            },
            onFileUploadComplete: function (file) {
                console.log(file.fieldname + ' uploaded to  ' + file.path);
            }
        };

        return multer(options);
    }
}

module.exports = new MulterImpl;