//clear feed
import {display_modal} from "./authentication.js";
import {api} from "./main.js";
import {check_online, checkStore, createElement} from "./helpers.js";
import {check_liked} from "./post.js";

export function clear_feed(){
    let currFeed = document.getElementById("feed");
    currFeed.textContent = '';
}
//clear all notifications
export function clear_notifications(){
    let notifications = document.getElementById('notifications');
    for(let child of notifications.children){
        child.textContent = '';
    }
}

//display users feed
export function display_feed(){
    document.getElementById("feed").style.display = "flex";
    document.getElementById('no-more-posts').style.display = 'block';
}

//retrieve users feed
export function retrieve_feed(options, numPosts = 5, fromPost = 0, currPage = 1){
    window.localStorage.setItem('currentPost', '0');
    window.localStorage.setItem('nextPost', '1');
    api.get("user/feed?p=" + fromPost + "&n="+numPosts, options)
        .then(res =>{
            //clear feed first
            clear_feed();
            //make sure online
            window.localStorage.setItem('status', 'online');
            //sort in reverse chron order
            let sorted_posts = res["posts"].sort((a, b) => {
                return parseFloat(b.meta.published) - parseFloat(a.meta.published);
            });
            //go through each post and add it to webpage
            let i = 1;
            for(let post of sorted_posts){
                //store first 5 posts in localStorage
                window.localStorage.setItem('post' + i, JSON.stringify(post));
                make_post(post);
                let currentPost = parseInt(window.localStorage.getItem('currentPost')) + 1;
                let nextPost = parseInt(window.localStorage.getItem('nextPost')) + 1;
                window.localStorage.setItem('currentPost', currentPost.toString());
                window.localStorage.setItem('nextPost', nextPost.toString());
                i++;
            }
            //if no network connection, get feed from localStorage
        }).catch(err => {
        clear_feed();
        retrieve_localStorage_feed();
        display_modal(err + "Currently in Offline Mode");
    });
}

//get posts stored in ls
export function retrieve_localStorage_feed(){
    //change to offline status
    window.localStorage.setItem('status', 'offline');
    for(let i = 1; i < 5; i++){
        make_post(JSON.parse(window.localStorage.getItem('post' + i)));
        let currentPost = parseInt(window.localStorage.getItem('currentPost')) + 1;
        let nextPost = parseInt(window.localStorage.getItem('nextPost')) + 1;
        window.localStorage.setItem('currentPost', currentPost.toString());
        window.localStorage.setItem('nextPost', nextPost.toString());
    }
}

//Given a post object, style it and add it to feed div
export function make_post(post){
    const section = createElement('section', null, { id: 'post-'+post.id, class: 'post' });
    const top = createElement('div', null, {style: 'display: flex; justify-content: space-between; align-items: center;'});
    top.appendChild(createElement('h2', post.meta.author, { class: 'author-name' }));
    section.appendChild(top);
    //if users post, add edit button
    if(post.meta.author === window.localStorage.getItem('username')){
        top.appendChild(createElement('button', 'Edit', {id: 'edit-' + post.id, value: post.id, class: 'edit-button btn btn-outline-dark'}));
    }
    const img_container = createElement('div', null, {class: 'img-container', display: 'flex'});
    img_container.style.textAlign = 'center';
    //decode base64 to png
    img_container.appendChild(createElement('img', null, {src: "data:image/png;base64," + post.src, alt: post.meta.description_text + "-post-" + post.id + "-by-" + post.meta.author, class: 'post-image' }));
    section.appendChild(img_container);
    //make sure button has class of likersBtn which is used for dynamic button event listener
    section.appendChild(createElement('p', "likes: " + post.meta.likes.length, {id: "num-likes-"+post.id, class: 'likersBtn'}));
    section.appendChild(createElement('button', "like", {id: 'like-'+post.id, class: 'likeBtn btn btn-outline-dark', value: post.id}));
    if(check_online()){
        check_liked(post.id);
    }
    section.appendChild(createElement('p',post.meta.author + ": " + post.meta.description_text));
    let date = new Date(parseFloat(post.meta.published) * 1000);
    section.appendChild(createElement('p',date.toLocaleString()));
    section.appendChild(createElement('p', "comments: " + post.comments.length));
    section.appendChild(createElement('button', "Show Comments", {id: post.id, class: 'commentsBtn btn btn-outline-info', value: false}));
    section.appendChild(createElement('div', null, {id: 'comments-' + post.id, class: 'comments-section', style: "display:none;"}));

    document.getElementById('feed').append(section);
}

//add more posts when user scrolls to bottom
export function add_more_to_feed(){
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        }
    };
    api.get("user/feed?p=" + window.localStorage.getItem('currentPost') + "&n=1", options)
        .then(res =>{
            for(let post of res.posts) {
                make_post(post);
                let nextPost = parseInt(window.localStorage.getItem('nextPost')) + 1;
                window.localStorage.setItem('nextPost', nextPost.toString());
            }
        }).catch(err => {
        display_modal(err + ". Unable to retrieve posts at this time.");
    });
}

//add notification
export function add_notification(person){
    let notifications = document.getElementById('notifications');
    for(let i = 3; i >= 0; i--){
        //push down notifications
        let recent = notifications.children[i];
        if(recent.textContent !== ''){
            let old = notifications.children[i + 1];
            old.textContent = recent.textContent;
        }
    }
    //change notification button to red
    document.getElementById('notifications-button').style.backgroundColor = '#FF0000';
    document.getElementById('notifications-button').style.color = '#FFFFFF';
    notifications.children[0].textContent = person + ' has just posted!';

}