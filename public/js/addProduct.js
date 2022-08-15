let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector('.loader');
// const imageBaseUrl = "http://localhost:5000/images";
const imageBaseUrl = "http://localhost:5000/use";

// checking if user is logged in
window.onload = () => {
    if (user) {
        if (!compareToken(user.authToken, user.data.email)) {
            location.replace('/login');
        }
    } else {
        location.replace('/login');
    }
}

// price inputs
const actualPrice = document.querySelector('#actual-price');
const discountPercentage = document.querySelector('#discount');
const sellingPrice = document.querySelector('#sell-price');

discountPercentage.addEventListener('input', () => {
    if (discountPercentage.value > 100) {
        discountPercentage.value = 90;
    } else {
        let discount = actualPrice.value * discountPercentage.value / 100;
        sellingPrice.value = actualPrice.value - discount;
    }
});

sellingPrice.addEventListener('input', () => {
    let discount = (sellingPrice.value / actualPrice.value) * 100;
    discountPercentage.value = discount
});

const showAlert = (msg) => {
    let alertBox = document.querySelector('.alert-box');
    let alertMsg = document.querySelector('.alert-msg');
    alertMsg.innerHTML = msg;
    alertBox.classList.add('show');
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
    return false;
}

// uploading image handle
let uploadImages = document.querySelectorAll('.fileupload');
// storing all uploaded image paths
let imagePaths = []; // will store all uploaded image paths;

uploadImages.forEach((fileUpload, index) => {
    fileUpload.addEventListener("change", async () => {
        const file = await fileUpload.files[0];


        console.log(file)
        // let imageUrl;

        // let uploadData = new FormData()
        // uploadData.append('files', file)

        if (file.type.includes("image")) {
            // means user uploade an image
            // fetch(`${imageBaseUrl}/uploadmultiple`, {
            //     method: "POST",
            //     // headers: new Headers({ 'Content-Type': "multipart/form-data" }),
            //     body: uploadData
            // })
            //     .then((res) => res.json())
            //     .then((response) => {
            //         console.log({ response });
            //         let label = document.querySelector(`label[for=${fileUpload.id}]`);
            //         // const data = response.map((datas) => {
            //         //     const { contentType, imageBase64 } = datas;
            //         //     console.log(datas)
            //         //     return label.style.backgroundImage = `url('data:${contentType};base64,${imageBase64}')`

            //         // });
            //         // label.style.backgroundImage = `url('data:${contentType};base64,${imageBase64}')`


            //     })
            const sendData = await axios.post(`${imageBaseUrl}/uploadmultiple`, { file: file });
            console.log(sendData)
            const { data } = await axios.get(`${imageBaseUrl}/images`);
            console.log(data)

        }

    })
})




// form submission
const productName = document.querySelector('#product-name');
const shortLine = document.querySelector('#short-des');
const des = document.querySelector('#des');

const stock = document.querySelector('#stock');
const tags = document.querySelector('#tags');
const termsAndConditions = document.querySelector('#termsAndConditions');

// buttons
const addProductBtn = document.querySelector('#add-btn');
const saveDraft = document.querySelector('#save-btn');

let sizes = []  // will store all the sizes

// store function
const storeSizes = () => {
    sizes = []  // will store all the sizes 
    let sizeCheckBox = document.querySelectorAll('.size-checkbox');
    sizeCheckBox.forEach(item => {
        if (item.checked) {
            sizes.push(item.value);
        }
    })
}

const validateForm = () => {
    if (!productName.value.length) {
        return showAlert('enter product name');
    } else if (shortLine.value.length > 100 || shortLine.value.length < 10) {
        return showAlert('short description must be between 10 and 100 letters long');
    } else if (!des.value.length) {
        return showAlert('enter detail description about the product');
        // } else if (!imagePaths.length) {
        //      return showAlert('upload atleast one image');
    } else if (!sizes.length) {// size array
        return showAlert('select atleast one size');
    } else if (!actualPrice.value.length || !discount.value.length || !sellingPrice.value.length) {
        return showAlert('you must add pricings')
    } else if (stock.value < 20) {
        return showAlert('you should have at least 20 items in stock');
    } else if (!tags.value.length) {
        return showAlert('enter few tags to help ranking your product in search')
    } else if (!termsAndConditions.checked) {
        return showAlert('you must agree to our terms and conditions');
    }

    return true;
}

const productData = () => {
    return data = {
        name: productName.value,
        shortDes: shortLine.value,
        des: des.value,
        images: imagePaths,
        sizes: sizes,
        actualPrice: actualPrice.value,
        discount: discount.value,
        sellPrice: sellingPrice.value,
        stock: stock.value,
        tags: tags.value,
        termsAndConditions: termsAndConditions.value,
        email: JSON.parse(sessionStorage.user).data.email
    }
}

const sendData = (path, data) => {
    fetch(path, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        //  parsing objects or data received in JSON string
        body: JSON.stringify(data)
    }).then((res) => res.json())
}

addProductBtn.addEventListener('click', () => {
    storeSizes();
    // validate form
    if (validateForm()) { // validateForm returns true or false during validation
        loader.style.display = "block";
        let data = productData();
        sendData('/add-product', data);
    }
})
