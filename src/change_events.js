
//when user posts something, they can press the input button to choose an image which will
//be displayed
import {check_edit_ready, check_online, check_post_ready, checkStore, uploadImage} from "./helpers.js";
import {add_more_to_feed, retrieve_feed} from "./feed.js";
import {get_person_profile} from "./users.js";
import {logout} from "./authentication.js";


//allow user to choose image
document.getElementById('input-photo').addEventListener('change', (e) => {
    //when user chooses image, remove current image if any
    let image = document.getElementById('post-photo');
    if (image !== null){
        image.remove();
    }
    uploadImage(e);
});

//when user edits a post, they can press the input button to choose another image which will
//be displayed
document.getElementById('edit-photo-button').addEventListener('change', (e) => {
    //when user chooses image, remove current image if any
    let image = document.getElementById('edit-photo');
    if (image !== null){
        image.remove();
    }
    uploadImage(e);
    //check if image and description is entered.. if yes, enable button
    check_edit_ready();
});

//enable post button only if description length > 0
document.getElementById('description').addEventListener('keyup', () => {
    check_post_ready();
});

//enable edit button only if description length > 0
document.getElementById('current-description').addEventListener('keyup', () => {
    check_edit_ready();
});

//if valid comment, enable button
document.getElementById('feed').addEventListener('keyup',function(e) {
    let user_comments = document.getElementsByClassName('comment-box');
    for (let comment_box of user_comments) {
        if(e.target === comment_box){
            let post_id = comment_box.id.replace('input-comment-', '');
            document.getElementById('make-comment-' + post_id).disabled = comment_box.value.length <= 0;
        }
    }
});

//if valid name, enable change name button
document.getElementById('update-name').addEventListener('keyup',function() {
    let name_input = document.getElementById('update-name');
    if(name_input.value.length > 0 && (!(/[^a-zA-Z]/.test(name_input.value)))){
        document.getElementById('submit-name').disabled = false;
        document.getElementById('update-message').textContent = '';
    }else{
        document.getElementById('submit-email').disabled = true;
        if(/[^a-zA-Z]/.test(name_input.value)){
            document.getElementById('update-message').textContent = "Name can only have letters.";
        }
    }
});

//if valid email, enable change email button
document.getElementById('update-email').addEventListener('keyup',function() {
    let email_input = document.getElementById('update-email');
    if(email_input.value.length > 0 && /\S+@\S+\.\S+/.test(email_input.value)){
        document.getElementById('submit-email').disabled = false;
        document.getElementById('update-message').textContent = '';
    }else{
        document.getElementById('submit-email').disabled = true;
        if(email_input.value.length > 5){
            document.getElementById('update-message').textContent = "hint: email must have @ and . in the email address";
        }
    }
});

//if valid pw's, enable change pw button
document.getElementById('update-password-form').addEventListener('keyup',function() {
    let password_input = document.getElementById('update-password');
    let confirm_password_input = document.getElementById('update-confirm-password');
    if(password_input.value !== '' && confirm_password_input.value !== '') {
        if (password_input.value.length > 5 && confirm_password_input.value.length > 5) {
            document.getElementById('submit-password').disabled = false;
            document.getElementById('update-message').textContent = '';
        } else {
            document.getElementById('update-message').textContent = "password length must be at least 6 characters";
            document.getElementById('submit-password').disabled = true;
        }
    }
});

//register submit button only enables when registration details are correct
document.getElementById('registerForm').addEventListener('keyup', () => {
    let un = document.getElementById('register-username').value;
    let pw = document.getElementById('register-password').value;
    let confirm_pw = document.getElementById('confirm-register-password').value;
    let email = document.getElementById('register-email').value;
    let name = document.getElementById('register-name').value;
    if(un.length > 0 && pw.length > 0 && confirm_pw.length > 0 && email.length > 0 && name.length > 0){
        //invalid username. Only allow upper and lower case letter and numbers
        if(!(/[^a-zA-Z0-9]/.test(un))) {
            if (pw === confirm_pw && pw.length > 5) {
                if (/\S+@\S+\.\S+/.test(email)) {
                    if(!(/[^a-zA-Z]/.test(name))){
                        document.getElementById('registerSubmit').disabled = false;
                        document.getElementById('registration-message').textContent = "Everything looks good.";
                    }else {
                        document.getElementById('registration-message').textContent = "Name can only have letters.";
                    }
                } else {
                    document.getElementById('registration-message').textContent = "Please enter valid email.";
                }
            } else {
                document.getElementById('registration-message').textContent = "Passwords must match and have at least 6 characters.";
            }
        }else{
            document.getElementById('registration-message').textContent = "Username can only have letters and numbers.";
        }
    }else{
        document.getElementById('registration-message').textContent = "Please fill all fields.";
        document.getElementById('registerSubmit').disabled = true;
    }
});

//if username and password is inputted, enable button
document.getElementById('loginForm').addEventListener('keyup', () => {
    let un = document.getElementById('login-username').value;
    let pw = document.getElementById('login-password').value;
    document.getElementById('loginSubmit').disabled = !(un.length > 0 && pw.length > 0);
});

//infinite scroll
document.getElementById('wrapper-container').addEventListener('scroll', () => {
    let wrapper = document.getElementById('wrapper-container');
    let feed = document.getElementById('feed');
    //Has to wait for a new post to show up before calling add_more_to_feed()
    //or else fetch will be called 1000x times
    let currentPost = parseInt(window.localStorage.getItem('currentPost'));
    let nextPost = parseInt(window.localStorage.getItem('nextPost'));
    if((wrapper.scrollTop + wrapper.offsetHeight > feed.offsetHeight - 100) && currentPost < nextPost && window.localStorage.getItem('location') === 'feed' && check_online()){
        currentPost++;
        window.localStorage.setItem('currentPost', currentPost.toString());
        //adds more post to feed
        add_more_to_feed();
    }
}, false);

//URL fragment based detection
window.addEventListener('hashchange', (e) => {
    e.preventDefault();
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    if(window.location.hash === '#profile=me'){
        window.localStorage.setItem('location', 'my-profile');
        get_person_profile(null, parseInt(window.localStorage.getItem('userID')));
    }else if(window.location.hash === '#feed'){
        document.getElementById('wrapper-container').style.height = '1000px';
        window.localStorage.setItem('location', 'feed');
        retrieve_feed(options);
    }else if(window.location.hash !== '#profile=me' && window.location.hash.includes('#profile=')){
        window.localStorage.setItem('location', 'other-profile');
        let name = window.location.hash.replace('#profile=', '');
        get_person_profile(name, null);
    }else{
        if(window.location.hash !== '#login-registration') {
            alert('invalid URL Fragment. Please press logo');
        }
    }
}, false);

//if refresh, logout
window.addEventListener('load', () => {
    logout();
});

//if window resize
window.addEventListener('resize', function(){
    let width = window.innerWidth;
    if(width >= 700) {
        document.getElementById("hamburger-menu-options").style.display = "none";
    }
});
