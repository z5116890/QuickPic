//display login form by changing form display attribute
import {checkStore} from "./helpers.js";
import {api} from "./main.js";
import {clear_feed, clear_notifications, display_feed} from "./feed.js";

export function display_login() {
    document.getElementById("registerDiv").style.display = "none";
    document.getElementById("loginDiv").style.display = "flex";
}

//display register form by changing form display attribute
export function display_register() {
    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("registerDiv").style.display = "flex";
}

//display modal and message by changing modal display attribute
export function display_modal(message){
    if (message !== null) {
        document.getElementById("modal-msg").innerHTML = "<h2>" + message + "</h2>";
    }
    document.getElementById("modal").style.display = "block";
    document.getElementById("modal-msg").style.display = "block";
    document.getElementById("add-post-container").style.display = "none";
}

//display logout button
export function display_loggedin_menu(){
    document.getElementById("logout").style.display = "inline";
    document.getElementById("my-profile").style.display = "inline";
    document.getElementById("notifications-button").style.display = "inline";
    document.getElementById('add-post').style.display = 'inline';
    document.getElementById("logout-mobile").style.display = "block";
    document.getElementById("my-profile-mobile").style.display = "block";
    document.getElementById("notifications-button-mobile").style.display = "block";
    document.getElementById('add-post-mobile').style.display = "block";
}

//close login form by changing form display attribute
export function close_login() {
    document.getElementById('loginSubmit').disabled = true;
    document.getElementById("loginDiv").style.display = "none";
}

//close login form by changing form display attribute
export function close_register() {
    document.getElementById('registerForm').reset();
    document.getElementById('registration-message').textContent = '';
    document.getElementById('registerSubmit').disabled = true;
    document.getElementById("registerDiv").style.display = "none";
}

//close modal by by changing modal display attribute
export function close_modal(){
    let modal = document.getElementById("modal");
    if(modal.style.display === 'block'){
        document.getElementById("modal").style.display = "none";
        document.getElementById("add-post-container").style.display = "none";
        document.getElementById("edit-post-container").style.display = "none";
        document.getElementById('warning').style.display = 'none';
        document.getElementById('update-user-container').style.display = "none";
        document.getElementById('modal-msg').style.display = "none";
        document.getElementById('notifications-container').style.display = 'none';
    }
}

//close login and register button
export function close_login_register(){
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("login-mobile").style.display = "none";
    document.getElementById("register-mobile").style.display = "none";
}

//login
export function complete_login(token){
    display_feed();
    close_login();
    close_login_register();
    display_loggedin_menu();
    window.localStorage.setItem('location', 'feed');
    //curr_location = "feed";
    //show feed
    //store token in localStorage
    window.localStorage.setItem('userToken', token);

    //set hash location
    window.location.hash = "feed";

}
function hide_logged_in(){
    //hide all thats necessary
    document.getElementById('offline-mode').style.display = "none";
    document.getElementById("logout").style.display = "none";
    document.getElementById("my-profile").style.display = "none";
    document.getElementById("notifications-button").style.display = "none";
    document.getElementById("logout-mobile").style.display = "none";
    document.getElementById("my-profile-mobile").style.display = "none";
    document.getElementById("notifications-button-mobile").style.display = "none";
    document.getElementById("login").style.display = "inline";
    document.getElementById("register").style.display = "inline";
    document.getElementById("login-mobile").style.display = "block";
    document.getElementById("register-mobile").style.display = "block";
    document.getElementById("feed").style.display = "none";
    document.getElementById('add-post').style.display = 'none';
    document.getElementById('add-post-mobile').style.display = 'none';
    document.getElementById('no-more-posts').style.display = 'none';
    document.getElementById('loginDiv').style.display = 'flex';
}
//logout
export function logout(){
    //clear local storage
    window.localStorage.clear();
    //set location to login page
    window.localStorage.setItem('location', 'login-registration');
    window.location.hash = 'login-registration';
    //set status to offline
    window.localStorage.setItem('status', 'offline');
    //clear everything
    clear_feed();
    clear_notifications();
    //hide all thats necessary
    hide_logged_in();
    close_hamburger();
}

//register
export function complete_register(){
    close_register();
    document.getElementById('loginDiv').style.display = 'flex';
    display_modal("Registration Successful. Please Login");
}


function close_hamburger(){
    document.getElementById('hamburger-menu-options').style.display = "none";

}
//handles login submit button
//gets form data and sends it to POST auth/login
//if error, display modal
//else display users feed
export function submit_login(e) {
    e.preventDefault();
    let un = document.getElementById("login-username").value;
    let pw = document.getElementById("login-password").value;
    const options = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "username": un,
            "password": pw,
        })
    };

    api.post("auth/login", options)
        .then(res => {
            //set status to online
            window.localStorage.setItem('status', 'online');
            complete_login(res['token']);
            //store userID given username
            get_userID(un);
            //store username
            window.localStorage.setItem('username', un);
            close_hamburger();


        })
        .catch(err => {
            display_modal(err + ". Unable to log in at this time.");
        });
    document.getElementById("loginForm").reset();
}

function reset_register(){
    document.getElementById("registerForm").reset();
    document.getElementById('registration-message').textContent = '';
}
//handles register submit button
//gets form data and sends it to POST auth/login
//if error, display modal with unsuccessful message
//else display modal  with successful message
export function submit_register(e) {
    e.preventDefault();
    let un = document.getElementById("register-username").value;
    let pw = document.getElementById("register-password").value;
    let email = document.getElementById("register-email").value;
    let name = document.getElementById("register-name").value;

    const options = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "username": un,
            "password": pw,
            "email": email,
            "name": name,
        })
    };

    api.post("auth/signup", options)
        .then(() => {
            complete_register();
        })
        .catch(err => {
            display_modal(err + ". Unable to sign up at this time.");
            reset_register();
        });

}

//given username, get user and store userID
export function get_userID(username){
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    api.get("user?username=" + username, options)
        .then(res => {
            window.localStorage.setItem('userID', res.id);
        }).catch(err => {
        display_modal(err + ". Unable to retrieve user information at this time.");
    });
}