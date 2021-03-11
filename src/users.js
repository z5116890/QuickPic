import {checkStore, createElement} from "./helpers.js";
import {display_modal} from "./authentication.js";
import {api} from "./main.js";
import {clear_feed, make_post} from "./feed.js";

//if following, show unfollow button
//if not, show follow button
export function is_following(person_id, follow, unfollow){
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    api.get('user?id='+ window.localStorage.getItem('userID'), options)
        .then(res => {
            for(let follower of res.following){
                if (person_id === follower){
                    follow.style.display = 'none';
                    return;
                }
            }
            unfollow.style.display = 'none';
        }).catch(e => {
        display_modal(e + ". Unable to determine if user is following this person.");
    });
}

//given a user object, make profile for user and add it to feed div
export function make_profile(user){
    const section = createElement('section', null, { id: 'profile-'+user.id, class: 'profile' });
    let top_container = createElement('div', null, {id: 'top-profile'});
    section.appendChild(top_container);
    //if users profile, enable update option and disable author link
    if (user.id === parseInt(window.localStorage.getItem('userID'))){
        top_container.appendChild(createElement('h2', user.username));
        top_container.appendChild(createElement('button', 'Update Profile', { id: 'update-profile', class: 'btn btn-outline-dark' }));
    }else{
        top_container.appendChild(createElement('h2', user.username, { class: 'author-name' }));
    }
    //follow and unfollow button
    if (user.id !== parseInt(window.localStorage.getItem('userID'))){
        let unfollow = createElement('button', 'Unfollow', {id: 'unfollow-'+user.username, value: user.username, class: 'unfollow btn btn-danger'});
        let follow = createElement('button', 'Follow', {id: 'follow-'+user.username, value: user.username, class: 'follow btn btn-success'});
        //if user is following person
        is_following(user.id, follow, unfollow);
        top_container.append(follow, unfollow);
    }
    section.appendChild(createElement('h3', 'Hi, my name is '+ user.name));
    let follow_div = createElement('div', null, {class: 'follow-container'});
    section.appendChild(follow_div);
    follow_div.appendChild(createElement('span', 'Followers: '+ user.followed_num, {id: 'follows-num-'+user.username}));
    follow_div.appendChild(createElement('span', ' Following: '+user.following.length, {id: 'following-num-'+user.username, class:'followings'}));
    document.getElementById('feed').append(section);
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    let sorted_posts = user.posts.sort((a, b) => {
        return (b - a);
    });
    //array of promises
    let promises = [];
    for(let post_id of sorted_posts){
        promises.push(api.get('post?id=' + post_id, options));
    }
    //will execute in order
    Promise.all(promises).then(res => {
        for(let post of res){
            make_post(post);
        }
    }).catch(err => display_modal(err + ". Unable to create profile at this time."));

}

//add follower to user when follow button pressed
export function add_follower(username){
    let follower = document.getElementById('follows-num-'+ username);
    let follower_num = follower.innerText.replace(/[^0-9]/g,'');
    follower.innerText = 'Followers: ' + (parseInt(follower_num) + 1);
}

//subtract follower to user when unfollow button pressed
export function subtract_follower(username){
    let follower = document.getElementById('follows-num-'+ username);
    let follower_num = follower.innerText.replace(/[^0-9]/g,'');
    follower.innerText = 'Followers: ' + (parseInt(follower_num) - 1);

}
//unfollow person and display follow button
export function unfollow(username){
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    api.put("user/unfollow?username=" + username, options)
        .then(res => {
            let unfollow = document.getElementById('unfollow-'+username);
            let follow = document.getElementById('follow-'+username);
            unfollow.style.display = 'none';
            follow.style.display = 'inline';
            subtract_follower(username);
        }).catch(err => {
        display_modal(err + ". Unable to unfollow at this time.");
    });
}

//follow person and display unfollow button
export function follow(username){
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    api.put("user/follow?username=" + username, options)
        .then(res => {
            let unfollow = document.getElementById('unfollow-'+username);
            let follow = document.getElementById('follow-'+username);
            follow.style.display = 'none';
            unfollow.style.display = 'inline';
            add_follower(username);
        }).catch(err => {
        display_modal(err + ". Unable to follow at this time.");
    });
}
//show list of people a user is following
export function display_followings(username){
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    api.get("user?username=" + username, options)
        .then(res => {
            let modal = document.getElementById('modal-msg');
            modal.textContent = '';
            modal.appendChild(createElement('h2', 'Following:'));
            res.following.forEach(following => {
                api.get("user?id=" + following, options)
                    .then(res => {
                        modal.appendChild(createElement('p', res.username, {class: 'followings-user', id: 'followings-user-'+res.id}));
                    }).catch(err => {
                    display_modal(err + ". Unable to display the list of followings at this time.");
                });
            });
            display_modal(null);
        }).catch(err => {
        display_modal(err + ". Unable to retrieve user at this time.");
    });
}
//given a username or userID, get the user object to pass into make_profile to make the profile of that user
export function get_person_profile(username, userID){
    clear_feed();
    //remove infinite scroll
    document.getElementById('wrapper-container').style.height = '100%';

    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    let path = 'user?';
    if (username === null){
        path += 'id=' + userID;
    }else{
        path += 'username='+ username;
    }
    api.get(path, options)
        .then(res => {
            make_profile(res);
        }).catch(err => {
        display_modal(err + ". Unable to retrieve profile at this time.");
    });
}


//update users name
export function change_name(new_name){
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "name": new_name
        }),
    };

    api.put('user', options)
        .then(res => {
            document.getElementById("update-user-container").style.display = "none";
            document.getElementById("update-name-form").reset();
            document.getElementById('submit-name').disabled = true;
            display_modal('name changed!');
            clear_feed();
            get_person_profile(null, parseInt(window.localStorage.getItem('userID')));
        }).catch(err => {
        display_modal(err + ". Unable to change name at this time.");
    });
}

//update email
export function change_email(new_email){
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": new_email
        }),
    };

    api.put('user', options)
        .then(res => {
            document.getElementById("update-user-container").style.display = "none";
            document.getElementById("update-email-form").reset();
            document.getElementById('submit-email').disabled = true;
            display_modal('email changed!');
            clear_feed();
            get_person_profile(null, parseInt(window.localStorage.getItem('userID')));
        }).catch(err => {
        display_modal(err + ". Unable to change email at this time.");
    });
}

//update password
export function change_password(pw, confirm_pw){
    if(pw !== confirm_pw){
        display_modal('passwords do not match!');
        return;
    }
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "password": pw
        }),
    };

    api.put('user', options)
        .then(res => {
            document.getElementById("update-user-container").style.display = "none";
            document.getElementById("update-password-form").reset();
            document.getElementById('submit-password').disabled = true;
            display_modal('password changed!');
            clear_feed();
            get_person_profile(null, parseInt(window.localStorage.getItem('userID')));
        }).catch(err => {
        display_modal(err + ". Unable to change passwords at this time.");
    });
}
