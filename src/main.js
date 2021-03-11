// importing named exports we use brackets
import {check_online, test_connection, update_followings} from './helpers.js';
// when importing 'default' exports, use below syntax
import API from './api.js';



//FUNCTIONS



//---EVENT LISTENERS---
//decides whether to like/unlike


const url = 'http://localhost:5000';
export const api  = new API(url);
//default current and next posts values
window.localStorage.setItem('currentPost', '0');
window.localStorage.setItem('nextPost', '1');
//location on website
window.localStorage.setItem('location', 'login-registration');



//every 2 seconds, check if any following has posted
setInterval(() => {
    if(check_online()) {
        test_connection(url);
        update_followings();
    }
}, 2000);
