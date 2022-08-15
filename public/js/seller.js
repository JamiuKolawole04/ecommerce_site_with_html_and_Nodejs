let loader = document.querySelector('.loader');

const becomeSellerElement = document.querySelector('.become-seller');
const applyForm = document.querySelector('.apply-form');
const showApplyFormBtn = document.querySelector('#apply-btn');
const productListingElement = document.querySelector('.product-listing');

// redirect user to home page if user logged in
window.onload = () => {
    // if user exists in session storage
    if (sessionStorage.user) {
        let user = JSON.parse(sessionStorage.user);
        if (compareToken(user.authToken, user.data.email)) {
            // if seller is false or there's no seller
            // let boo = user.data.seller;
            // console.log(boo);

            if (!user.data.seller) {
                becomeSellerElement.classList.remove('hide');
                // productListingElement.classList.remove('hide');
            } else {
                productListingElement.classList.remove('hide');
                // becomeSellerElement.classList.remove('hide')
            }

        } else {
            location.replace('/login');
        }
    } else {
        location.replace('/login');
    }
}

showApplyFormBtn.addEventListener('click', () => {
    becomeSellerElement.classList.add('hide');
    applyForm.classList.remove('hide')
});

// form submission
const applyFormButton = document.querySelector('#apply-form-btn');
const businessName = document.querySelector('#business-name');
const address = document.querySelector('#business-add');
const about = document.querySelector('#about');
const number = document.querySelector('#number');
const termsAndConditions = document.querySelector('#terms-and-conditions');
const legitInfo = document.querySelector('#legitInfo');

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
    console.log(data);
    loader.style.display = null;
    if (data.alert) {
        showAlert(data.alert)
    } else if (data.data) {
        // create auth token
        data.authToken = generateToken(data.data.email)
        // store data in session
        sessionStorage.user = JSON.stringify(data);
        location.replace('/');
    } else if (data == true) {
        let user = JSON.parse(sessionStorage.user);
        user.data.seller = true;
        sessionStorage.user = JSON.stringify(user);
        location.reload();
    }
}

// /**
//  *
//  * alert and show error function for form validation
//  */
const showAlert = (msg) => {
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);

}

applyFormButton.addEventListener('click', () => {
    if (!businessName.value.length || !address.value.length || !about.value.length || !number.value.length) {
        showAlert('fill all the inputs')
    } else if (!termsAndConditions.checked || !legitInfo.checked) {
        showAlert('You must agree to our terms and conditions')
    } else {
        // making sever request
        loader.style.display = 'block';
        sendData('/seller', {
            name: businessName.value,
            address: address.value,
            about: about.value,
            number: number.value,
            termsAndConditions: termsAndConditions.checked,
            legitInfo: legitInfo.checked,
            email: JSON.parse(sessionStorage.user).data.email
        })

    }
})