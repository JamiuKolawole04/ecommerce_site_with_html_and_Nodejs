const createNav = () => {
    let nav = document.querySelector('nav');
    nav.innerHTML = `
        <div class="nav d-flex justify-content-between row">
            <img src="./img/dark-logo.png" alt="brand-logo">
            <div class="nav-items d-flex align-center">
                <div class="search d-flex">
                    <input type="text" class="search-box" placeholder="search brand, product">
                    <button class="search">search</button>
                </div>
                <a>
                    <img src="./img/user.png" alt="" id="user-img">
                    <div class="login-logout-popup hide">
                        <p class="account-info">Log in as, name</p>
                        <button class="btn" id="user-btn">Log out</button>
                    </div>
                </a>
                <a href="#"><img src="./img/cart.png" alt=""></a>
            </div>
        </div>
        <ul class="links-container d-flex justify-content-center">
            <li class="link-item"><a href="#" class="link">home</a></li>
            <li class="link-item"><a href="#" class="link">women</a></li>
            <li class="link-item"><a href="#" class="link">men</a></li>
            <li class="link-item"><a href="#" class="link">kids</a></li>
            <li class="link-item"><a href="#" class="link">accessories</a></li>
        </ul>
    
    `
}

createNav();

// nav pop up
const userImageButton = document.querySelector('#user-img')
    , userPop = document.querySelector('.login-logout-popup')
    , popuptext = document.querySelector('.account-info')
    , actionBtn = document.querySelector('#user-btn');


userImageButton.addEventListener('click', () => {
    userPop.classList.toggle('hide');
});

window.onload = () => {
    let user = JSON.parse(sessionStorage.user || null);
    if (user != null) {
        // user is present in session storage
        // user is logged in
        popuptext.innerHTML = `log in as, ${user.data.name}`;
        // the logout btn is selected here and 'Log Out' is passed as its text content
        actionBtn.innerHTML = `log out`;
        // on clicking the logout btn, clear the session and reload the page.
        actionBtn.addEventListener('click', () => {
            sessionStorage.clear();
            location.reload();
        })

    } else {
        // user is logged out
        popuptext.innerHTML = `log in to place order`;
        actionBtn.innerHTML = 'log in';
        actionBtn.addEventListener('click', () => {
            location.href = '/login';
        })
    }
}