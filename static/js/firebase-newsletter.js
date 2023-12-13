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

var email = document.getElementById("email-newsletter");
var button_submit = document.getElementById("submit-newsletter");
var message_status = document.getElementById("database-response-newsletter");

function insertData(e){
  e.preventDefault();
  const regEx = /\./g
  const userDoc = db.collection('subscription').doc(email.value.toString());
    userDoc.set({
        MessageTime: new Date().toString(),
        Email: email.value.toString(),
    })
    message_status.textContent = "Thank you for subscribing our newsletter!";
    console.log("Newsletter subscribed in favor of: "+email.value.toString());

}
button_submit.addEventListener('click',insertData);

