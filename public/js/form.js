// redirect user to home page if user logged in
window.onload = () => {
    // if user exists in session storage
    if (sessionStorage.user) {
        // parsing data received from session storage into objects from JSON string
        let user = JSON.parse(sessionStorage.user);
        if (compareToken(user.authToken, user.data.email)) {
            location.replace('/');
        }

    }
}

const submitBtn = document.querySelector('button')
    , nameInputDOM = document.querySelector('#name') || null
    , email = document.querySelector('#email')
    , password = document.querySelector('#password')
    , number = document.querySelector('#number') || null
    , termsAndConditions = document.querySelector('#terms-and-conditions') || null
    , notifications = document.querySelector('#notifications') || null
    , loader = document.querySelector('.loader');


submitBtn.addEventListener('click', () => {
    /**
     * FRONTEND FORM AND LOGIN PAGE VALIDATION
     */


    // Sign up page form validation
    if (nameInputDOM != null) {
        if (nameInputDOM.value.length < 3) {
            showAlert('name must be 3 letters long');
        } else if (!email.value.length) {
            showAlert('enter your email');
        } else if (password.value.length < 8) {
            showAlert('password should be atleast 8 letters long')
        } else if (!number.value.length) {
            showAlert('enter your phone number')
        } else if (!(Number(number.value)) || number.value.length < 10) {
            showAlert('invalid number, please enter a valid one')
        } else if (!termsAndConditions.checked) {
            showAlert('you must agree to our terms and conditions')
        } else {
            // submit the form
            loader.style.display = 'block';
            sendData('/signup', {
                name: nameInputDOM.value,
                email: email.value,
                password: password.value,
                number: number.value,
                termsAndConditions: termsAndConditions.checked,
                notifications: notifications.checked,
                seller: false
            })

        }
    } else {
        // Login page form validation
        if (!email.value.length || !password.value.length) {
            showAlert('fill all the inputs');
        } else {
            // Get the data and login
            loader.style.display = 'block';
            sendData('/login', {
                email: email.value,
                password: password.value,
            })
        }
    }
});

// send data function
const sendData = (path, data) => {
    fetch(path, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        //  parsing objects or data received in JSON string
        body: JSON.stringify(data)
    }).then((res) => res.json())
        .then(response => {
            processData(response)
        })
}
// process data function
const processData = (data) => {
    loader.style.display = null;
    if (data.alert) {
        showAlert(data.alert)
    } else if (data.data) {
        // create auth token
        data.authToken = generateToken(data.data.email)
        // store data in session
        sessionStorage.user = JSON.stringify(data);
        location.replace('/');

    }
}

/**
 * 
 * alert and show error function for form validation
 */
const showAlert = (msg) => {
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);

}