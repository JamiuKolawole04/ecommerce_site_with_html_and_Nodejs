const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// name, email, password, number, terms and conditions, notifications, seller

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    number: {
        type: String,
        required: true,
        minlength: 10,
    },
    termsAndConditions: {
        type: String,
        default: true
    },
    notifications: {
        type: String,
        default: false
    },
    seller: {
        type: String,
        default: false,
    },
}, { timestamps: true });


// Middleware in mongoose
// In mongoose 5.x, instead of calling next() manually, you can use a function that returns a promise.
// In particular, you can use async/await

/**
         * Hashing password logic with "bcrypt" library
         * Generate the salt throuh genSalt() function
         * Hash the passoword through hash() function alogside the salt generated initially
         * store the hashed password in the database
         */
userSchema.pre("save", async function () {
    // generating salts in 10 rounds
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

module.exports = mongoose.model("user", userSchema);