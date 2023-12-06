const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyAkVyX1QTlBD29pVNlPlZrPClxognzDpGY",
    authDomain: "fypdb-51f76.firebaseapp.com",
    databaseURL: "https://fypdb-51f76-default-rtdb.firebaseio.com",
    projectId: "fypdb-51f76",
    storageBucket: "fypdb-51f76.appspot.com",
    messagingSenderId: "564402143637",
    appId: "1:564402143637:web:3ad7a63e34107b662d769c",
    measurementId: "G-82VKWRVC62"
});
const db = firebaseConfig.firestore();
const auth = firebaseConfig.auth();

// FOR SIGNUP PAGE //
var companyTitle = document.getElementById("company-title");
var companyEmail = document.getElementById("company-email");
var companyContact = document.getElementById("company-contact");
var companyWebsite = document.getElementById("company-website");
var companyLocation = document.getElementById("company-location");

var userDesignation = document.getElementById("user-designation");
var userFullname = document.getElementById("user-name");
var userContact = document.getElementById("user-contact");
var userEmail = document.getElementById("user-email");

var loginEmail = document.getElementById("login-email");
var loginPassword = document.getElementById("login-password");

var submit = document.getElementById("form-submit");

var login_status = document.getElementById("database-response");
var form = document.getElementById("signup-form");
//

// Sign up function
const signUp = (event) => {
    
    var LoginEmail = loginEmail.value;
    var LoginPassword = loginPassword.value;
    event.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const uppercasePattern = /[A-Z]/;
    const lowercasePattern = /[a-z]/;
    const digitPattern = /\d/;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    if(LoginEmail != null) {
        if(LoginPassword.length >= 8)
            firebase.auth().createUserWithEmailAndPassword(LoginEmail, LoginPassword)
            .then((userCredential) => {
                login_status.textContent = "You are Signed Up";
                console.log(userCredential)

                const userDoc = db.collection('users').doc(userCredential.user.uid);
                userDoc.set({
                    SignupTime: new Date().toString(),

                    CompanyTitle: companyTitle.value.toString(),
                    CompanyEmail: companyEmail.value.toString(),
                    CompanyContact: companyContact.value.toString(),
                    CompanyWebsite: companyWebsite.value.toString(),
                    CompanyLocation: companyLocation.value.toString(),
                
                    UserDesignation: userDesignation.value.toString(),
                    UserFullname: userFullname.value.toString(),
                    UserContact: userContact.value.toString(),
                    UserEmail: userEmail.value.toString(),
                });
                form.reset();
                setTimeout(function() {
                    window.location.href = "login.html";
                }, 2000);
            })
            .catch((error) => {
                login_status.textContent = "Error" + error.code;
                console.log(error.message)
            });
        else {      
            login_status.textContent = "Password Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters";
        }
    }
    else {
        login_status.textContent = "Please correctly submit the fields.";
        
    }
}
function firebase_auth(email, password) {
    
}
