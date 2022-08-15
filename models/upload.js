const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        unique: true,
    },
    contentType: {
        type: String,
        required: true,
    },
    imageBase64: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('uploads', uploadSchema);