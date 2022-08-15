// parsing the ".env" file content into production "process.env" environment  
require('dotenv').config();

// importing packages
const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const connectDB = require('./db/db');
const store = require("./middleware/multer");
const imgRoute = require("./router/imgRoute")

// importing the user database model
/**
 * importing
 * User, Seller and Upload model databases
 */
const User = require('./models/user');
const Seller = require('./models/sellers');

// PORT FOR THE SERVER
const PORT = process.env.PORT || 5000;

// Declaring static path
let staticPath = path.join(__dirname, 'public')

// initializing express
const app = express();

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(staticPath))

// routes
// home routes
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// signup form page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(staticPath, 'signup.html'));
});
// signup route server handler route
app.post('/signup', async (req, res) => {
    const { name, email, password, number, termsAndConditions, notifications, seller } = req.body;
    // Validate form here
    if (name.length < 3) {
        return res.status(400).json({ alert: 'name must be 3 letters long' })
    } else if (!email.length) {
        return res.status(400).json({ alert: 'enter your email' });
    } else if (password.length < 8) {
        return res.status(400).json({ alert: 'password should be atleast 8 letters long' })
    } else if (!number.length) {
        return res.status(400).json({ alert: 'enter your phone number' })
    } else if (!(Number(number)) || number.length < 10) {
        return res.status(400).json({ alert: 'invalid number, please enter a valid one' })
    } else if (!termsAndConditions) {
        return res.status(400).json({ alert: 'you must agree to our terms and conditions' })
    } else {
        /**
         * store user in database
         * check if user exists, then proceed with other logiics
         */
        const user = await User.findOne({ email: email });
        if (user) {
            // if user exists, return an error and send it to the server
            return res.status(403).json({ alert: 'email already exists' });
        }

        const register = await User.create({ ...req.body });
        res.status(201).json({ data: register });

    }
});

// Login form page 
app.get('/login', (req, res) => {
    res.sendFile(path.join(staticPath, 'login.html'));
});
// Login server handler route
app.post('/login', async (req, res) => {
    // Getting the email and password from form body which is the request body (req.body); 
    const { email, password } = req.body;
    // if email or password does not exist, return an error
    if (!email || !email.length || !password || !password.length) {
        return res.status(403).json({ alert: 'fill all the inputs' })
    }
    // searching for the provided email in the database
    const user = await User.findOne({ email });
    // if user is not in database, throw an error
    if (!user) {
        return res.status(401).json({ alert: 'Invalid credentials' })
    }
    // compare password if it is the same with the stored password in database
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) return res.status(401).json({ alert: 'Invalid credentials' });
    res.status(200).json({ data: { name: user.name, email: user.email, seller: user.seller } });
});

// seller form page
app.get('/seller', (req, res) => {
    res.sendFile(path.join(staticPath, 'seller.html'));
});

// seller server handler route
app.post('/seller', async (req, res) => {
    let { name, address, about, number, termsAndConditions, legitInfo, email } = req.body;
    if (!name.length || !address.length || !about.length || number.length < 10 || !Number(number)) {
        return res.status(400).json({ alert: 'some information(s) is/ are invalid' });
    } else if (!termsAndConditions || !legitInfo) {
        return res.json({ alert: 'you must agree to our terms and conditions' })
    } else {
        try {
            const seller = await Seller.create({ ...req.body });
            // update users seller status
            try {
                const user = await User.findOneAndUpdate({ email }, { seller: true }, {
                    new: true,
                    runValidators: true
                });
                if (!user) {
                    return res.status(404).json({ alert: 'cant update record' })
                }
            } catch (error) {
                console.log(error)

            }
            return res.status(200).json(true)
        } catch (err) {
            res.status(500).json({ err: err });
            console.log(err)
        }

    }
});

// add product page
app.get('/add-product', (req, res) => {
    res.sendFile(path.join(staticPath, 'addProduct.html'))
});

app.post('/add-product', (req, res) => {

});

// add image route
app.use("/use", imgRoute)
// 404 route
app.get('/404', (req, res) => {
    res.sendFile(path.join(staticPath, '404.html'));
});

// error handler middleware
// not found
app.use((req, res) => {
    res.redirect('/404');
})

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () =>
            console.log(`Server  listening on port ${PORT}...`)
        );
    } catch (error) {
        console.log(error);
    }
}

start();

