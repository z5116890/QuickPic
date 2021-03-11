
//button to get likers
import {if_liked, post_comment, retrieve_comments, retrieve_likers, show_edit_post} from "./post.js";
import {display_followings, follow, unfollow} from "./users.js";
import {check_online} from "./helpers.js";
import {display_modal} from "./authentication.js";
import {display_update_modal} from "./modal.js";

//button to get likers of a post
document.getElementById('feed').addEventListener('click',(e) => retrieve_likers(e));

//button to get comments
document.getElementById('feed').addEventListener('click',(e) => retrieve_comments(e));

//button to like/unlike
document.getElementById('feed').addEventListener('click',(e) => if_liked(e));

//unfollow button
document.getElementById('feed').addEventListener('click',(e) => {
    if(e.target.className === 'unfollow btn btn-danger'){
        if(check_online()) {
            unfollow(e.target.value);
        }else{
            display_modal("Cannot perform action because you are offline.");
        }
    }
});

//follow button
document.getElementById('feed').addEventListener('click',(e) => {
    if(e.target.className === 'follow btn btn-success'){
        if(check_online()) {
            follow(e.target.value);
        }else{
            display_modal("Cannot perform action because you are offline.");
        }
    }
});

//click authors name to go to their personal profile page
document.getElementById('feed').addEventListener('click',function(e){
    if(e.target.className === 'author-name'){
        if(check_online()) {
            window.localStorage.setItem('location', 'other-profile');
            //hash change event will handle this click event
            window.location.hash = 'profile=' + e.target.textContent;
        }else{
            display_modal("Cannot perform action because you are offline.");
        }
    }
});

//click following to see list of people that a user follows on their personal profile page
document.getElementById('feed').addEventListener('click',function(e){
    if(e.target.className === 'followings'){
        if(check_online()) {
            let un = e.target.id.replace('following-num-', '');
            display_followings(un);
        }else{
            display_modal("Cannot perform action because you are offline.");
        }
    }
});

//click edit button to edit post
document.getElementById('feed').addEventListener('click',function(e){
    if(e.target.className === 'edit-button btn btn-outline-dark'){
        if(check_online()) {
            //remove current image if any
            let image = document.getElementById('edit-photo');
            if (image !== null) {
                image.remove();
            }
            let submit_button = document.getElementById('editSubmit');
            let delete_button = document.getElementById('edit-delete');
            submit_button.value = e.target.value;
            delete_button.value = e.target.value;
            document.getElementById('edit-form').reset();
            show_edit_post(e.target.value);
        }else{
            display_modal("Cannot perform action because you are offline.");
        }
    }
});


//make comment button will post a new comment on a post
document.getElementById('feed').addEventListener('click',function(e){
    let make_comment_buttons = document.getElementsByClassName('post-comment btn btn-outline-dark');
    for(let button of make_comment_buttons){
        if(e.target === button) {
            e.preventDefault();
            let post_id = button.id.replace('make-comment-', '');
            post_comment(post_id);
        }
    }
});

//update profile button will allow user to update name, email and pw
document.getElementById('feed').addEventListener('click',function(e){
    if(e.target.id === 'update-profile'){
        if(check_online()) {
            display_update_modal();
        }else{
            display_modal("Cannot perform action because you are offline.");
        }
    }
});

