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

// Downloading PDF //
function downloadPDF() {

    document.getElementById('download-pdf').style.display = 'none';
    document.getElementById("back-button").style.display = 'none';
    
    // Call the print() function
    window.print();
    
    // Show the buttons after printing
    document.getElementById('download-pdf').style.display = 'block';
    document.getElementById("back-button").style.display = 'block';
    
}