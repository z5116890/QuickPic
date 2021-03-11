//show the warning for deleting posts
export function display_delete_warning(){
    document.getElementById('warning').style.display = 'block';
}

//close the warning
export function close_delete_warning(){
    document.getElementById('warning').style.display = 'none';
}

//modal for user to update details
export function display_update_modal(){
    document.getElementById("modal").style.display = 'block';
    document.getElementById("update-user-container").style.display = "flex";
    document.getElementById("modal-msg").style.display = "none";
}
