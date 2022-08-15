const UploadModel = require('../models/upload');
const fs = require('fs');

exports.upload = (req, res, next) => {

    const files = req.files;
    console.log(files);
    if (!files) {
        const err = new Error({ alert: "Please choose files" }).toString();
        err.httpStatusCode = 400;
        // return next(err);
        return res.status(400).json({ alert: "please choose files" })
    }
    // convert images to base64 encoding
    let imgArray = files.map((file) => {
        // returns image as buuffer
        let img = fs.readFileSync(file.path);
        // converting files to base 64 url
        return ecode_img = img.toString('base64')

    })

    let result = imgArray.map((src, index) => {
        // create object to store data in the collection
        let finalImage = {
            filename: files[index].originalname,
            contentType: files[index].mimetype,
            imageBase64: src
        }

        let newUpload = new UploadModel(finalImage);

        return newUpload
            .save()
            .then(() => {
                return { msg: `${files[index].originalname}Image uploaded successfully...!` }
            })
            .catch(err => {
                if (err) {
                    if (err.name === 'MongoError' && err.code === 11000) {
                        return Promise.reject({ error: `Duplicate ${files[index].originalname}. File Already exists! ` })
                    }
                    return Promise.reject({ error: err.message || `Cannot upload ${files[index].originalname} something missing` })
                }
            })
    });
    Promise.all(result)
        .then(msg => {
            // res.json(msg);
            res.redirect('/')
        })
        .catch(err => {
            res.json(err);
        })


}