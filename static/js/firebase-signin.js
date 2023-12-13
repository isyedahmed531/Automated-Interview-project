const firebaseConfig = firebase.initializeApp({
  apiKey: 'AIzaSyAkVyX1QTlBD29pVNlPlZrPClxognzDpGY',
  authDomain: 'fypdb-51f76.firebaseapp.com',
  databaseURL: 'https://fypdb-51f76-default-rtdb.firebaseio.com',
  projectId: 'fypdb-51f76',
  storageBucket: 'fypdb-51f76.appspot.com',
  messagingSenderId: '564402143637',
  appId: '1:564402143637:web:3ad7a63e34107b662d769c',
  measurementId: 'G-82VKWRVC62',
})
const db = firebaseConfig.firestore()
const auth = firebaseConfig.auth()

var form = document.getElementById('login-form')

// FOR SIGNIN PAGE //
const signIn = () => {
  var loginEmail_2 = document.getElementById('user-email-login')
  var loginPassword_2 = document.getElementById('user-password-login')
  var response = document.getElementById('database-response')

  //var status = document.getElementById("database-response");
  //
  const LoginEmail = loginEmail_2.value
  const LoginPassword = loginPassword_2.value
  // firebase code
  firebase
    .auth()
    .signInWithEmailAndPassword(LoginEmail, LoginPassword)
    .then((result) => {
      console.log('Successful Signin')
      const user = result.user
      sessionStorage.setItem('user', JSON.stringify(user))
      window.location.href ="../static/dashboard/dashboard.html"
    })
    .catch((error) => {
      response.textContent = error.message
    })
  return true
}
document
  .getElementById('login-submit')
  .addEventListener('click', function (event) {
    event.preventDefault() // prevent form submission

    var spinner = document.getElementById('spinner')
    spinner.style.display = 'inline-block'

    setTimeout(function () {
      spinner.style.display = 'none'
      if (signIn() == true) {
      } else {
        alert('Invalid user. Please try again.')

        document.getElementById('spinner').style.display = 'none'
        document.getElementById('loginButton').disabled = false
      }
    }, 500)
  })
document
  .getElementById('noaccount-signup-button')
  .addEventListener('click', function (event) {
    event.preventDefault()
    window.location.href = 'signup.html'
  })

// JavaScript code for Forget Password

const emailInput = document.getElementById('email')
const resetPasswordButton = document.getElementById('forgot-password-button')
const resetPasswordStatus = document.getElementById('forgot-password-status')

document
  .getElementById('forgot-password')
  .addEventListener('click', function () {
    // Get the modal element
    var modal = document.getElementById('forgot-password-modal')

    // Show the modal using Bootstrap's modal() method
    $(modal).modal('show')
  })

// Add event listener to reset password button
resetPasswordButton.addEventListener('click', async (event) => {
  event.preventDefault()

  // Get email value
  const email = emailInput.value

  // Send password reset email
  try {
    await firebase.auth().sendPasswordResetEmail(email)
    resetPasswordStatus.innerText =
      'Password reset link has been sent to your email.'
    resetPasswordStatus.classList.remove('text-danger')
    resetPasswordStatus.classList.add('text-success')
  } catch (error) {
    resetPasswordStatus.innerText = error.message
    resetPasswordStatus.classList.remove('text-success')
    resetPasswordStatus.classList.add('text-danger')
  }
})
