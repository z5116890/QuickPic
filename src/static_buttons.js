//Show LOGIN Button
import {
    close_login,
    close_modal,
    close_register,
    display_login,
    display_modal,
    display_register,
    logout,
    submit_login,
    submit_register
} from "./authentication.js";
import {close_delete_warning, display_delete_warning} from "./modal.js";
import {add_post, delete_post, edit_post, post_setup} from "./post.js";
import {check_online, checkStore} from "./helpers.js";
import {change_email, change_name, change_password} from "./users.js";

//show login form
document.getElementById('login').addEventListener('click', () => display_login());

//show login form
document.getElementById('login-mobile').addEventListener('click', () => display_login());

//Submit login button
document.getElementById('loginSubmit').addEventListener('click', (e) => submit_login(e));

//LOGOUT Button
document.getElementById('logout').addEventListener('click', () => logout());

//LOGOUT Button mobile
document.getElementById('logout-mobile').addEventListener('click', () => logout());

//Close login button
document.getElementById('loginClose').addEventListener('click', () => close_login());

//show registration button
document.getElementById('register').addEventListener('click', () => display_register());

//show registration button
document.getElementById('register-mobile').addEventListener('click', () => display_register());

//close registration button
document.getElementById('registerClose').addEventListener('click', () => close_register());

//submit registration button
document.getElementById('registerSubmit').addEventListener('click', (e) => submit_register(e));

//close modal button
document.getElementById("modalClose").addEventListener('click', () => close_modal());

//close warning button
document.getElementById("warningClose").addEventListener('click', () => close_delete_warning());

//click on my profile button to go to users profile
document.getElementById('my-profile').addEventListener('click',function(){
    if(check_online()) {
        window.localStorage.setItem('location', 'my-profile');
        //hash change event will handle this click event
        window.location.hash = 'profile=me';
    }else{
        display_modal("Cannot perform action because you are offline.");
    }
});

//click on my profile button to go to users profile mobile
document.getElementById('my-profile-mobile').addEventListener('click',function(){
    if(check_online()) {
        window.localStorage.setItem('location', 'my-profile');
        //hash change event will handle this click event
        window.location.hash = 'profile=me';
    }else{
        display_modal("Cannot perform action because you are offline.");
    }
});

//show notification modal
function show_notification_modal(){
    document.getElementById('modal').style.display = 'block';
    document.getElementById('notifications-container').style.display = 'block';
    document.getElementById('notifications-button').style.backgroundColor = '#f6fffe';
    document.getElementById('notifications-button').style.color = '#000000';
}
//click on my notifications button to see notifications modal
document.getElementById('notifications-button').addEventListener('click',show_notification_modal);

//click on my notifications button to see notifications modal mobile
document.getElementById('notifications-button-mobile').addEventListener('click',show_notification_modal);

//click on my + button to add post
document.getElementById('add-post').addEventListener('click',post_setup);

//click on my + button to add post mobile
document.getElementById('add-post-mobile').addEventListener('click',post_setup);


//when viewing followings list, clicking on persons username will show users page
document.getElementById('modal-content').addEventListener('click',function(e){
    if(e.target.className === 'followings-user'){
        if(check_online()) {
            close_modal();
            //hashchange event handles this event
            window.location.hash = 'profile=' + e.target.textContent;
        }else{
            display_modal("Cannot perform action because you are offline.");
        }
    }
});


//click logo to go back to feed
document.getElementById('logo').addEventListener('click',function(){
    if(checkStore('userToken') === null){
        logout();
        return;
    }
    //hash change event will handle this click event
    window.location.hash = 'feed';
    window.localStorage.setItem('location', 'feed');
});

//post button to post
document.getElementById('postSubmit').addEventListener('click', (e) => {
    add_post(e);
});

//edit button to post
document.getElementById('editSubmit').addEventListener('click', (e) => {
    let submit_button = document.getElementById('editSubmit');
    edit_post(submit_button.value, e);
});

//delete button
document.getElementById('edit-delete').addEventListener('click', (e) => {
    e.preventDefault();
    display_delete_warning();
});

//confirm yes delete button
document.getElementById('yes-delete').addEventListener('click', (e) => {
    e.preventDefault();
    let delete_button = document.getElementById('edit-delete');
    delete_post(delete_button.value);
});

//confirm no delete button
document.getElementById('no-delete').addEventListener('click', (e) => {
    e.preventDefault();
    close_delete_warning();
});

//clicking anywhere on screen will close modal
window.addEventListener('click', (e) => {
    let modal = document.getElementById('modal');
    if(e.target.id !== 'add-post' && e.target.id !== 'add-post-span' && e.target === modal) {
        close_modal();
    }
});

//update name button
document.getElementById('submit-name').addEventListener('click',function(e){
    e.preventDefault();
    let new_name = document.getElementById('update-name').value;
    change_name(new_name);
});

//update email button
document.getElementById('submit-email').addEventListener('click',function(e){
    e.preventDefault();
    let new_email = document.getElementById('update-email').value;
    change_email(new_email);
});

//update password button
document.getElementById('submit-password').addEventListener('click',function(e){
    e.preventDefault();
    let pw = document.getElementById('update-password').value;
    let confirm_pw = document.getElementById('update-confirm-password').value;
    change_password(pw, confirm_pw);
});

//hamburger menu
document.getElementById('hamburger-menu').addEventListener('click', function (e){
    let menu = document.getElementById("hamburger-menu-options");
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
});