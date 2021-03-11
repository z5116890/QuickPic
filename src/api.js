// change this when you integrate with the real API, or when u start using the dev server
//const API_URL = 'http://localhost:8080/data'
const API_URL = 'http://localhost:5000'

//make new promise. wait till fetch gets response.
//If main promise is resolved i.e. status === 200, return res.json()
//if reject, throw error message which will be caught and console logged
const getJSON = (path, options) => {
    return new Promise((resolve, reject) => {
        fetch(path, options)
            .then(res => {
                if(res.status !== 200){
                    res.json().then(data => {
                        reject(data['message']);
                    }).catch(error => {
                        console.log(error);
                        reject(error);
                    });
                }else{
                    console.log("success");
                    resolve(res.json());
                }
            }).catch(err => {
                console.log(err);
                reject(err);
        });
    });
}

/**
 * This is a sample class API which you may base your code on.
 * You don't have to do this as a class.
 */
export default class API {

    /**
     * Defaults to teh API URL
     * @param {string} url 
     */
    constructor(url = API_URL) {
        this.url = url;
    } 

    post(path, options) {
        return getJSON(`${this.url}/${path}`, {
            ...options,
            method: 'POST'
        });
    }

    put(path, options) {
        return getJSON(`${this.url}/${path}`, {
            ...options,
            method: 'PUT'
        });
    }

    get(path, options) {
        return getJSON(`${this.url}/${path}`, {
            ...options,
            method: 'GET'
        });
    }
    delete(path, options) {
        return getJSON(`${this.url}/${path}`, {
            ...options,
            method: 'DELETE'
        });
    }

}
