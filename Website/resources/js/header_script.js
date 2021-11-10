
//gets cookie by name
function getCookie(name) {
    var cookieArr = document.cookie.split(";");
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

function isLoggedIn(){
    // console.log(getCookie('user'));

    var user=getCookie('user');
    if(user != null){
        let l=document.getElementById("loginID");
        l.innerHTML="Log out";
        l.setAttribute("href","/logout");
    }
    else{
        let l=document.getElementById("loginID");
        l.innerHTML="Sign in";
        l.setAttribute("href","/login");
    }
}