function check_fields_profile() {
    let pass=document.getElementById("change_password").value;
    let email=document.getElementById("change_email").value;
    let submit=document.getElementById("submit");
    if (pass == "" || email == "") {
        submit.disabled = true;
    }
    else {
        submit.disabled = false;
    }
}