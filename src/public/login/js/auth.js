const auth_uri = 'http://127.0.0.1:4000/api/v1/login';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const email = document.getElementById('emailInnput');
const password = document.getElementById('password');
const submitButton = document.getElementById('submit');
submitButton.addEventListener('click', function (event) {
    event.preventDefault();
    if (emailRegex.test(email.value) && password.value !== "") {
        const options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        };
        fetch(auth_uri, options)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    localStorage.setItem('user', '');
                    throw new Error("Network response was not ok.");
                }
            })
            .then(data => {
                const userData = Object.assign({}, { token: data.token, ...data.userInfo });
                if (data?.success === true) {
                    //console.log(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    if( userData.role === "customer" || userData.role === "admin" ){
                        return window.location.href = "/customer/index.html"
                    }
                    if(userData.role === "driver"){
                        return window.location.href = "/driver/index.html"
                    }
                    
                } else {
                    localStorage.setItem('user', '');
                    alert(" Authentification failed, please enter correct email or  password ");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                localStorage.setItem('user', '');
            });
    } else {
        alert(' Enter Valid Email and password ');
    }
})