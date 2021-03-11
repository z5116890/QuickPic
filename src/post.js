//check if post has been liked
import {check_edit_ready, check_online, check_post_ready, checkStore, createElement} from "./helpers.js";
import {display_modal} from "./authentication.js";
import {api} from "./main.js";
import {clear_feed} from "./feed.js";
import {get_person_profile} from "./users.js";
import {close_delete_warning} from "./modal.js";


export function check_liked(post_id){
    //if liked already, like button should be red
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    //first get the post
    api.get("post?id=" + post_id, options)
        .then(res => {
            let likers = res.meta.likes;
            //go through list of likers and get each user
            //add to message which will be added to modal
            let button = document.getElementById('like-'+post_id);
            for(let liker of likers){
                if(parseInt(window.localStorage.getItem('userID')) === liker){
                    button.style.backgroundColor = '#ff6060';
                    button.style.color = '#FFFFFF';
                    button.textContent = 'liked';
                    return;
                }

            }
            button.style.backgroundColor = '#FFFFFF';
            button.style.color = '#000000';
            button.textContent = 'like';
        }).catch(err => {
        display_modal(err + ". Unable to retrieve information of post at this time.");
    });
}

//retrieve the likers of a post
export function get_post_and_show_likers(post_id){
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    //first get the post
    api.get("post?id=" + post_id, options)
        .then(res => {
            let likers = res.meta.likes;
            let message = '<h2>People who liked: </h2>';
            if (likers.length === 0){
                display_modal(message);
                return;
            }
            //go through list of likers and get each user
            //add to message which will be added to modal
            for(let liker of likers){
                api.get("user?id=" + liker, options)
                    .then(res => {
                        message += '<p>' + res.username + '</p>';
                        display_modal(message);
                    }).catch(err => {
                    display_modal(err + ". Unable to determine likers at this time.");
                });
            }
        }).catch(err => {
        display_modal(err + ". Unable to retrieve information of this post at this time.");
    });
}

//retrieve the comments on a post
export function get_post_and_show_comments(post_id){
    const comment_section = document.getElementById('comments-'+post_id);
    comment_section.textContent = '';
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    //first get the post
    api.get("post?id=" + post_id, options)
        .then(res => {
            let comment_section = document.getElementById('comments-'+post_id);
            let sorted_comments = res.comments.sort((a, b) => {
                return parseFloat(a.published) - parseFloat(b.published);
            });
            for (let comment of sorted_comments){
                comment_section.appendChild(make_comment(comment));
            }
            //add make comment button to the end of comments
            let comment_container = createElement('div', null, {class: 'comment-container'});
            let comment_form = createElement('form', null, {id: 'comment-form-' + post_id, class: 'comment-form'});
            comment_container.appendChild(comment_form);
            comment_section.appendChild(comment_container);
            comment_form.appendChild(createElement('textarea', null, {id: 'input-comment-' + post_id, class: 'comment-box', form: comment_form, rows: '4', cols: '20'}));
            comment_form.appendChild(createElement('button', 'Comment', {id: 'make-comment-'+ post_id, class: 'post-comment btn btn-outline-dark', value: post_id, disabled: 'true'}));
        }).catch(err => {
        display_modal(err + ". Unable to retrieve information of this post at this time.");
    });
}

//given a comment, return how a comment will look
function make_comment(comment){
    const section = createElement('section', null);
    let author_date = createElement('div', null, {class: 'author-date-container'});
    section.appendChild(author_date);
    author_date.appendChild(createElement('h3', comment.author));
    const date = new Date(parseFloat(comment.published) * 1000);
    author_date.appendChild(createElement('p', date.toLocaleString(), {class:'comment-date'}));
    section.appendChild(createElement('p', comment.comment));
    return section;
}

//post comment when user presses make comment button
export function post_comment(post_id){
    let comment = document.getElementById('input-comment-' + post_id).value;
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "comment": comment
        })
    };
    api.put('post/comment?id='+ post_id, options)
        .then(res => {
            get_post_and_show_comments(post_id);
        }).catch(err => {
        display_modal(err + ". Unable to post this comment at this time.");
    });
}



//add like to post
export function put_like(post_id){
    //if not already liked, add like to total likes
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    api.put("post/like?id=" + post_id, options)
        .then(res => {
            let likes = document.getElementById("num-likes-"+post_id);
            let currLikes = likes.innerText.replace(/[^0-9]/g,'');
            likes.innerText = "likes: " + (parseInt(currLikes) + 1);
            check_liked(post_id);

        }).catch(err => {
        display_modal(err + ". Unable to like this post at this time.");
    });
}

//remove users like from post
export function remove_like(post_id){
    //if not already liked, add like to total likes
    //if already liked, pressing the button again removes the like
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    api.put("post/unlike?id=" + post_id, options)
        .then(res => {
            let likes = document.getElementById("num-likes-"+post_id);
            let currLikes = likes.innerText.replace(/[^0-9]/g,'');
            likes.innerText = "likes: " + (parseInt(currLikes) - 1);
            check_liked(post_id);
        }).catch(err => {
        display_modal(err + ". Unable to remove like at this time.");
    });
}
//display modal + enter post info + add post
export function show_add_post(){
    document.getElementById("modal").style.display = 'block';
    document.getElementById("add-post-container").style.display = "block";
    document.getElementById("modal-msg").style.display = "none";
}

//post the post
export function add_post(e){
    e.preventDefault();
    //photo and description always exists
    let description = document.getElementById('description').value;
    let photo_src = document.getElementById("post-photo").src.replace(/data:.*base64,/, '');

    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "description_text": description,
            "src": photo_src
        }),
    };

    api.post('post/', options)
        .then(res => {
            document.getElementById("add-post-container").style.display = "none";
            document.getElementById("post-form").reset();
            display_modal('posted!');
            clear_feed();
            window.location.hash = '#profile=me';
        }).catch(err => {
        display_modal(err + ". Unable to post at this time.");
    });


}

//display modal with edit options for when user wants to edit post
export function show_edit_post(post_id){
    document.getElementById("modal").style.display = 'block';
    document.getElementById("edit-post-container").style.display = "block";
    document.getElementById("modal-msg").style.display = "none";
    const curr_image = createElement('img', null, { id: 'edit-photo'});
    let edit_div = document.getElementById('current-photo');
    edit_div.insertBefore(curr_image, edit_div.firstChild);
    let curr_desc = document.getElementById('current-description');
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    //get post and show current picture and text description
    api.get("post?id=" + post_id, options)
        .then(res => {
            curr_image.src = "data:image/png;base64," + res.src;
            curr_desc.innerText = res.meta.description_text;
            check_edit_ready();
        }).catch(err => {
        display_modal(err + ". Unable to edit post at this time.");
    });
}

//given post id, edit post
export function edit_post(post_id, e){
    e.preventDefault();
    //photo and description always exists
    let description = document.getElementById('current-description').value;
    let photo_src = document.getElementById("edit-photo").src.replace(/data:.*base64,/, '');

    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "description_text": description,
            "src": photo_src
        }),
    };
    api.put('post?id='+post_id, options)
        .then(res => {
            document.getElementById("edit-post-container").style.display = "none";
            document.getElementById("edit-form").reset();
            display_modal('post edited!');
            clear_feed();
            get_person_profile(null, parseInt(window.localStorage.getItem('userID')));
        }).catch(err => {
        display_modal(err + ". Unable to edit post at this time.");
    });

}
//given post id, delete post
export function delete_post(post_id){
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json',
        }
    };
    api.delete('post?id='+post_id, options)
        .then(res => {
            document.getElementById("edit-post-container").style.display = "none";
            document.getElementById("edit-form").reset();
            close_delete_warning();
            display_modal('post deleted!');
            clear_feed();
            get_person_profile(null, parseInt(window.localStorage.getItem('userID')));
        }).catch(err => {
        display_modal(err + ". Unable to delete post at this time.");
    });
}

//display list of likers of a post
export function retrieve_likers(e){
    if(e.target.className === 'likersBtn'){
        if(check_online()) {
            let post_id = e.target.id.replace('num-likes-', '');
            get_post_and_show_likers(post_id);
        }else{
            display_modal("Cannot perform action because you are offline.");
        }
    }
}

//retrieve comments of a post
export function retrieve_comments(e){
    if(e.target.className === 'commentsBtn btn btn-outline-info'){
        if(check_online()) {
            let comment_section = document.getElementById('comments-' + e.target.id);
            if (e.target.textContent === 'Show Comments') {
                e.target.textContent = 'Hide Comments';
                get_post_and_show_comments(e.target.id);
                comment_section.style.display = 'flex';
                comment_section.style.flexDirection = 'column';
            } else {
                e.target.textContent = 'Show Comments';
                comment_section.style.display = 'none';
            }
        }else{
            display_modal("Cannot perform action because you are offline.");
        }
    }
}
//check whether liked/unliked
export function if_liked(e){
    if(e.target.className === 'likeBtn btn btn-outline-dark'){
        if(check_online()) {
            if (e.target.textContent === 'like') {
                put_like(e.target.value);
            } else {
                remove_like(e.target.value);
            }
        }else{
            display_modal("Cannot perform action because you are offline.");
        }
    }
}

//setup for a post
export function post_setup(){
    if(check_online()) {
        //remove current image if any
        let image = document.getElementById('post-photo');
        if (image !== null) {
            image.remove();
        }
        document.getElementById('post-form').reset();
        check_post_ready();
        show_add_post();
    }else{
        display_modal("Cannot perform action because you are offline.");
    }
}


