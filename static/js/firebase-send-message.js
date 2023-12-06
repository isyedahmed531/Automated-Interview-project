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

var name = document.getElementById("name");
var email = document.getElementById("email");
var subject = document.getElementById("subject");
var message = document.getElementById("message-request");

var button_submit = document.getElementById("send-message");
var form = document.getElementById("send-message-form");

var status = document.getElementById("database-response");

function insertData(e){
  e.preventDefault();
  const regexUpper = /[a-z]/g;
    var key = name.value.replace(regexUpper, function(match) {
    return match.toUpperCase();
  });
  const userDoc = db.collection('message-requests').doc(key);
    userDoc.set({
        MessageTime: new Date().toString(),

        Name: name.value.toString(),
        Email: email.value.toString(),
        Subject: subject.value.toString(),
        Message: message.value.toString(),
    })
    status.textContent = "Your message sent successfully!";
    console.log("Message sent to Database by: "+name.value.toString());
    form.reset();
}
button_submit.addEventListener('click',insertData);

