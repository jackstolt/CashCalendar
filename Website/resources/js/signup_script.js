function check_fields_signup() {
    let pass=document.getElementById("pass");
    let email=document.getElementById("email");
    let user=document.getElementById("user");
    let name=document.getElementById("name");
    let confirmpass=document.getElementById("confirmpass");
    let submit=document.getElementById("submit");
    if (pass.value == "" || email.value == "" || user.value=="" || name.value=="" || confirmpass.value=="" || pass.value != confirmpass.value) {
        if(name.value != ""){
            if(name.classList.contains("is-invalid")){
                name.classList.replace("is-invalid", "is-valid");
            }
            else{
                name.classList.add("is-valid");
            }

        }
        else if(name.classList.contains("is-valid")){
            name.classList.replace("is-valid", "is-invalid");
        }

        if(user.value != ""){
            if(user.classList.contains("is-invalid")){
                user.classList.replace("is-invalid", "is-valid");
            }
            else{
                user.classList.add("is-valid");
            }
        
        }
        else if(user.classList.contains("is-valid")){
            user.classList.replace("is-valid", "is-invalid");
        }

        if(pass.value != ""){
            if(pass.classList.contains("is-invalid")){
                pass.classList.replace("is-invalid", "is-valid");
            }
            else{
                pass.classList.add("is-valid");
            }
        
        }
        else if(pass.classList.contains("is-valid")){
            pass.classList.replace("is-valid", "is-invalid");
        }

        if(email.value != ""){
            if(email.classList.contains("is-invalid")){
                email.classList.replace("is-invalid", "is-valid");
            }
            else{
                email.classList.add("is-valid");
            }
        
        }
        else if(email.classList.contains("is-valid")){
            email.classList.replace("is-valid", "is-invalid");
        }

        if(pass.value != "" && confirmpass.value != "" && pass.value == confirmpass.value){
            console.log("hi:",pass.value);
            if(confirmpass.classList.contains("is-invalid")){
                confirmpass.classList.replace("is-invalid", "is-valid");
            }
            else{
                confirmpass.classList.add("is-valid");
            }
        }
        else if(pass.value !="" && confirmpass.value != "" && pass.value != confirmpass.value){
            console.log("hi1",pass.value);
            if(confirmpass.classList.contains("is-valid")){
                confirmpass.classList.replace("is-valid", "is-invalid");
            }
            else if(confirmpass.value != ""){
                confirmpass.classList.add("is-invalid");
            }
        }
        else if(pass.value =="" || confirmpass.value==""){
            console.log("hi2",pass.value);
            if(confirmpass.classList.contains("is-valid")){
                confirmpass.classList.replace("is-valid", "is-invalid");
            }
        }

        submit.disabled = true;

    }
    else {
        if(name.classList.contains("is-invalid")){
            name.classList.replace("is-invalid", "is-valid");
        }
        else{
            name.classList.add("is-valid");
        }
        if(user.classList.contains("is-invalid")){
            user.classList.replace("is-invalid", "is-valid");
        }
        else{
            user.classList.add("is-valid");
        }
        if(pass.classList.contains("is-invalid")){
            pass.classList.replace("is-invalid", "is-valid");
        }
        else{
            pass.classList.add("is-valid");
        }
        if(confirmpass.classList.contains("is-invalid")){
            confirmpass.classList.replace("is-invalid", "is-valid");
        }
        else{
            confirmpass.classList.add("is-valid");
        }
        if(email.classList.contains("is-invalid")){
            email.classList.replace("is-invalid", "is-valid");
        }
        else{
            email.classList.add("is-valid");
        }

        submit.disabled = false;
    }
}