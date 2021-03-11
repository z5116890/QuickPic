/* returns an empty array of size max */
import {add_notification} from "./feed.js";
import {display_modal} from "./authentication.js";
import {api} from "./main.js";

export const range = (max) => Array(max).fill(null);

/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

/**
 * You don't have to use this but it may or may not simplify element creation
 * 
 * @param {string}  tag     The HTML element desired
 * @param {any}     data    Any textContent, data associated with the element
 * @param {object}  options Any further HTML attributes specified
 */
export function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;
   
    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post 
 * @returns {HTMLElement}
 */
export function createPostTile(post) {
    const section = createElement('section', null, { class: 'post' });

    section.appendChild(createElement('h2', post.meta.author, { class: 'post-title' }));

    section.appendChild(createElement('img', null, 
        { src: '/images/'+post.src, alt: post.meta.description_text, class: 'post-image' }));

    return section;
}

// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(event) {
    const [ file ] = event.target.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
    
    // if we get here we have a valid image
    const reader = new FileReader();
    
    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result;
        //update image for posting something
        if(event.target.id === 'input-photo') {
            let image = createElement('img', null, { id: 'post-photo', src: dataURL });
            let post_div = document.getElementById('upload-photo');
            post_div.insertBefore(image, post_div.firstChild);
            check_post_ready();
        //update image for editing post
        }else{
            const image = createElement('img', null, { id: 'edit-photo', src: dataURL });
            let edit_div = document.getElementById('current-photo');
            edit_div.insertBefore(image, edit_div.firstChild);
            check_edit_ready();
        }
    };

    // this returns a base64 image
    reader.readAsDataURL(file);
}

/* 
    Reminder about localStorage
    window.localStorage.setItem('AUTH_KEY', someKey);
    window.localStorage.getItem('AUTH_KEY');
    localStorage.clear()
*/
export function checkStore(key) {
    if (window.localStorage)
        return window.localStorage.getItem(key)
    else
        return null

}

//check if user can post
export function check_post_ready(){
    let photo = document.getElementById("post-photo");
    let input = document.getElementById('description');
    document.getElementById('postSubmit').disabled = !(input.value.length > 0 && photo !== null);
}

//check if user can edit
export function check_edit_ready(){
    let input = document.getElementById('current-description');
    document.getElementById('editSubmit').disabled = input.value.length <= 0;
}

//reject interation if offline
export function check_online(){
    return window.localStorage.getItem('status') !== 'offline';

}

//sends request to check if it goes through. if not, offline mode
export function test_connection(url) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        window.localStorage.setItem('status', 'online');
        document.getElementById('offline-mode').style.display = 'none';
    }
    xhr.onerror = function() {
        window.localStorage.setItem('status', 'offline');
        //display offline message
        document.getElementById('offline-mode').style.display = 'block';
    }
    xhr.open("GET",url,true);
    xhr.send();
}

//updates users followings in local storage
//goes through list of people that user is following
//if person-id adds new post, alert user
export function update_followings(){
    if(window.localStorage.getItem('userID') === null || checkStore('userToken') == null){
        return;
    }
    const options = {
        headers: { 'Authorization': 'Token ' + checkStore('userToken'),
            'Content-Type': 'application/json'
        },
    };
    //get user
    api.get("user?id=" + window.localStorage.getItem('userID'), options)
        .then(res => {
            res.following.forEach(person => {
                api.get("user?id=" + person, options)
                    .then(res => {
                        //get num posts in ls
                        let userPostsNum = window.localStorage.getItem('Following: ' + person);
                        //if in local storage
                        if(userPostsNum !== null){
                            //check if value in ls < real post number value
                            if(parseInt(userPostsNum) < res.posts.length){
                                //alert and then update new value
                                alert('new post by' + res.name);
                                add_notification(res.name);
                                window.localStorage.setItem('Following: ' + person, res.posts.length.toString());
                            }
                            //store in ls
                        }else{
                            window.localStorage.setItem('Following: ' + person, res.posts.length.toString());
                        }
                    }).catch(e => {
                    display_modal(e + ". Cannot fetch notifications at this time.");
                });
            });
        }).catch(e => {
        display_modal(e + ". Cannot fetch notifications at this time");
    });
}