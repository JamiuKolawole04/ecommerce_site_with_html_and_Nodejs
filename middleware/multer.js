const multer = require('multer');

// set storage 
var storage = multer.diskStorage({
    // cb means call back
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        // image.jpg
        var ext = file.originalname.substr(file.originalname.lastIndexOf("."));
        cb(null, file.fieldname + '-' + Date.now() + ext)
    }
})

store = multer({ storage: storage });

module.exports = store;