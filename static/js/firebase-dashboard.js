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
const db = firebase.firestore();

const userDetails = JSON.parse(sessionStorage.getItem("user"));
var welcome = document.getElementById("company-title-dashboard");
        
// Retrieve the user data from Firestore
db.collection('users').doc(userDetails.uid).get().then(doc => {
    if (doc.exists) {
        const data = doc.data();
        welcome.textContent = "Welcome "+data.CompanyTitle+"!";

    } else {
        console.log("No such document!");
    }
}).catch(error => {
    console.log("Error getting document:", error);
});
const logoutBtn = document.getElementById('logout-button');

    logoutBtn.addEventListener('click', (event) => {
        event.preventDefault();

        // sign out user from Firebase Authentication
        firebase.auth().signOut().then(() => {
            // clear session storage
            sessionStorage.removeItem("user");

            // redirect user to login page
            window.location.href = '/login.html';
        }).catch((error) => {
        console.error(error);
        
        window.location.href = "login.html";
    });
});
