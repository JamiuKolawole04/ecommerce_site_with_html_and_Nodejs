const mongoose = require('mongoose');
const sellersSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    email: {
        type: mongoose.Schema.Types.String,
        ref: "User",
        required: true
    },
    number: {
        type: String,
        required: true,
        minlength: 10,
    },
    termsAndConditions: {
        type: String,
        default: true,
    },
    legitInfo: {
        type: String,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Seller", sellersSchema);