# Vanilla JS: Quickpic

## Background

The front-end is created entirely using Vanilla JS which interacts with a RESTFUL API HTTP back-end that is built in Python/Flask.

Information about how to talk to this API can be found the "promises & fetch" lecture.

The page is a single page app (SPA) which give websites an "app-like feeling", and are characterised by their use of a single full load of an initial HTML page, and then using AJAX/fetch to dynamically manipulate the DOM without ever required a full page reload. In this way, SPAs are generated, rendered, and updated using Javascript. Because SPAs don’t require a user to navigate away from a page to do anything, they retain a degree of user and application state. In short, this means `index.html` is the only HTML page, and that any sense of "moving between pages" will just be modifications of the DOM.


### Registration & Login 

This focuses on the basic user interface to register and log in to the site.

#### 1. Login
 * When the user isn't logged in, the site shall present a login form that contains:
   * a username field (text)
   * a password field (password)
   * submit button to login
 * When the submit button is pressed, the form data should be sent to `POST /auth/login` to verify the credentials. If there is an error during login an appropriate error should appear on the screen.
 * Once the user is logged in, they should be able to see the feed which says "Not yet implemented"

#### 2. Registration
 * When the user isn't logged in, the login form shall provide a link/button that opens the register form. The register form will contain: 
   * a username field (text)
   * a password field (password)
   * a confirm password field (password) - not passed to backend, but error thrown on submit if doesn't match other password
   * an email address (text)
   * a name (text)
   * submit button to register
 * When the submit button is pressed, the form data should be sent to `POST /auth/signup` to verify the credentials. If there is an error during login an appropriate error should appear on the screen.
 * Once the user is logged in, they should be able to see the feed which says "Not yet implemented"

#### 3. Error Popup
 * Whenever the frontend or backend produces an error, there shall be an error popup on the screen with a message (either a message derived from the backend error rresponse, or one meaningfully created on the frontend).
 * This popup can be closed/removed/deleted by pressing an "x" or "close" button.

### Basic Feed 

Focuses on fetching feed data from the API.

#### 1. Basic Feed

The application should present a "feed" of user content on the home page derived `GET /user/feed`.

The posts should be displayed in reverse chronological order (most recent posts first). 

Each post should display:
1. Who the post was made by
2. When it was posted
3. The image itself
4. How many likes it has (or none)
5. The post description text
6. How many comments the post has

Although this is not a graphic design exercise you should produce pages with a common and somewhat distinctive look-and-feel. You may find CSS useful for this.

## Advanced Feed 
 
Requires some backend interaction.

### 1. Show Likes
* Allow an option for a user to see a list of all users who have liked a post.

### 2. Show Comments
* Allow an option for a user to see all the comments on a post.

### 3. Ability for you to like content
* A logged in user can like a post on their feed and trigger a api request (`PUT /post/like`)
* For now it's ok if the like doesn't show up until the page is refreshed.

### 4. Feed Pagination
* Users can page between sets of results in the feed using the position token with (`GET user/feed`).
* Note users can ignore this if they properly implement Infinite Scroll in a later milestone.

## Other users & profiles

### 1. Profile View / Profile View
* Let a user click on a user's name/picture from a post and see a page with the users name, profile pic, and other info.
* The user should also see on this page all posts made by that person.
* The user should be able to see their own page as well.

### 2. Follow
* Let a user follow/unfollow another user too add/remove their posts to their feed via (`PUT user/follow`)
* Add a list of everyone a user follows in their profile page.
* Add just the count of followers / follows to everyones public user page

## 3. Adding & updating content (10%)

Milestone 5 focuses on more advanced features that will take time to implement and will involve a more rigourously designed app to execute.

### 4. Adding a post
* Users can upload and post new content from a modal or seperate page via (`POST /post`)

### 5. Updating & deleting  a post
* Let a user update a post they made or delete it via (`DELETE /post`) or (`PUT /post`)

### 6. Leaving comments
* Users can write comments on "posts" via (`POST post/comment`)

### 7. Updating the profile
* Users can update their personal profile via (`PUT /user`) E.g:
  * Update email address
  * Update password
  * Update name


### Infinite Scroll
* Instead of pagination, users an infinitely scroll through results. For infinite scroll to be properly implemented you need to progressively load posts as you scroll. 

### Live Update
* If a user likes a post or comments on a post, the posts likes and comments should update without requiring a page reload/refresh.

### Push Notifications
* Users can receive push notifications when a user they follow posts an image. To know whether someone or not has made a post, you must "poll" the server (i.e. intermittent requests, maybe every second, that check the state). 


### Static feed offline access
* Users can access the most recent feed they've loaded even without an internet connection.
* Cache information from the latest feed in local storage in case of outages.
* When the user tries to interact with the website at all in offline mode (e.g. comment, like) they should receive errors

### Fragment based URL routing
Users can access different pages using URL fragments:
```
/#profile=me
/#feed
/#profile=janecitizen
```


### Browser Compatibility

You should ensure that your programs have been tested on one of the following two browsers:
 * Locally, Google Chrome (various operating systems) version 85.XX
 * On CSE machines, Chromium version 83.XX

