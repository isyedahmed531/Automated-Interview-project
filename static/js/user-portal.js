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
const db = firebase.firestore()

// Get a reference to the HTML elements
const companyTitle = document.getElementById('view-company-title')
const companyEmail = document.getElementById('view-company-email')
const companyContact = document.getElementById('view-company-contact')
const companyWebsite = document.getElementById('view-company-website')
const companyLocation = document.getElementById('view-company-location')
const userDesignation = document.getElementById('view-user-designation')
const userFullname = document.getElementById('view-user-name')
const userContact = document.getElementById('view-user-contact')
const userEmail = document.getElementById('view-user-email')

var edit_companyTitle = document.getElementById('edit-company-title')
var edit_companyEmail = document.getElementById('edit-company-email')
var edit_companyContact = document.getElementById('edit-company-contact')
var edit_companyWebsite = document.getElementById('edit-company-website')
var edit_companyLocation = document.getElementById('edit-company-location')
var edit_userDesignation = document.getElementById('edit-user-designation')
var edit_userFullname = document.getElementById('edit-user-name')
var edit_userContact = document.getElementById('edit-user-contact')
var edit_userEmail = document.getElementById('edit-user-email')

// Retrieve the user data from sessionStorage
const userDetails = JSON.parse(sessionStorage.getItem('user'))
console.log('Logged in with user ID: ' + userDetails.uid)

// Retrieve the user data from Firestore
db.collection('users')
  .doc(userDetails.uid)
  .get()
  .then((doc) => {
    if (doc.exists) {
      const data = doc.data()
      fieldValues(data)
    } else {
      console.log('No such document!')
    }
  })
  .catch((error) => {
    console.log('Error getting document:', error)
  })
// // FOR LOG OUT //
// const logoutBtn = document.getElementById('logout-button');

//     logoutBtn.addEventListener('click', (event) => {
//         event.preventDefault();

//         // sign out user from Firebase Authentication
//         firebase.auth().signOut().then(() => {
//             // clear session storage
//             sessionStorage.removeItem("user");

//             // redirect user to login page
//             window.location.href = '/login.html';
//         }).catch((error) => {
//         console.error(error);

//         window.location.href = "login.html";
//     });
// });
// Value section
function fieldValues(data) {
  companyTitle.textContent = data.CompanyTitle
  companyEmail.textContent = data.CompanyEmail
  companyContact.textContent = data.CompanyContact
  companyWebsite.textContent = data.CompanyWebsite
  companyLocation.textContent = data.CompanyLocation
  userDesignation.textContent = data.UserDesignation
  userFullname.textContent = data.UserFullname
  userContact.textContent = data.UserContact
  userEmail.textContent = data.UserEmail

  edit_companyTitle.value = data.CompanyTitle
  edit_companyEmail.value = data.CompanyEmail
  edit_companyContact.value = data.CompanyContact
  edit_companyWebsite.value = data.CompanyWebsite
  edit_companyLocation.value = data.CompanyLocation

  edit_userDesignation.value = data.UserDesignation
  edit_userFullname.value = data.UserFullname
  edit_userContact.value = data.UserContact
  edit_userEmail.value = data.UserEmail
}
// MODAL SECTION //

// Edit Company Profile //
$(document).ready(function () {
  $('#edit-profile-company').click(function () {
    $('#edit-company-modal').modal('show')
  })
})
$(document).ready(function () {
  $('#edit-company-close-button').click(function () {
    $('#edit-company-modal').modal('hide')
  })
})

const edit_company_save_button = document.getElementById(
  'edit-company-save-button'
)
edit_company_save_button.addEventListener('click', async () => {
  const docRef = firebase.firestore().collection('users').doc(userDetails.uid)
  const updateData = {
    CompanyTitle: edit_companyTitle.value,
    CompanyEmail: edit_companyEmail.value,
    CompanyContact: edit_companyContact.value,
    CompanyWebsite: edit_companyWebsite.value,
    CompanyLocation: edit_companyLocation.value,
  }

  try {
    await docRef.update(updateData)
    db.collection('users')
      .doc(userDetails.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data()
          fieldValues(data)
        } else {
          console.log('No such document!')
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error)
      })
    console.log('Document updated successfully!')
  } catch (error) {
    console.error('Error updating document:', error)
  }
})

// Edit User Profile //
$(document).ready(function () {
  $('#edit-profile-hr').click(function () {
    $('#edit-user-modal').modal('show')
  })
})
$(document).ready(function () {
  $('#edit-user-close-button').click(function () {
    $('#edit-user-modal').modal('hide')
  })
})

const edit_user_save_button = document.getElementById('edit-user-save-button')
edit_user_save_button.addEventListener('click', async () => {
  const docRef = firebase.firestore().collection('users').doc(userDetails.uid)
  const updateData = {
    UserDesignation: edit_userDesignation.value,
    UserFullname: edit_userFullname.value,
    UserContact: edit_userContact.value,
    UserEmail: edit_userEmail.value,
  }
  try {
    await docRef.update(updateData)
    db.collection('users')
      .doc(userDetails.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data()
          fieldValues(data)
        } else {
          console.log('No such document!')
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error)
      })
    console.log('Document updated successfully!')
  } catch (error) {
    console.error('Error updating document:', error)
  }
})

// Edit Password Section //
$(document).ready(function () {
  $('#change-password').click(function () {
    $('#edit-password-modal').modal('show')
  })
})
$(document).ready(function () {
  $('#password-close-button').click(function () {
    $('#edit-password-modal').modal('hide')
  })
})
const password_change_button = document.getElementById('password-change-button')
password_change_button.addEventListener('click', function (event) {
  event.preventDefault()

  var currentPassword = document.getElementById('current-password').value
  var newPassword = document.getElementById('new-password').value.toString()
  console.log(userDetails)
  if (userDetails && userDetails.email) {
    var user = firebase.auth().currentUser
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // Create a credential with the user's email and current password
        var credential = firebase.auth.EmailAuthProvider.credential(
          userDetails.email,
          currentPassword
        )

        // Reauthenticate the user with the credential
        user
          .reauthenticateWithCredential(credential)
          .then(function () {
            // User successfully reauthenticated, now update the password
            if (newPassword.trim().length === 0) {
              console.log('Please enter new password')
            } else {
              user
                .updatePassword(newPassword)
                .then(function () {
                  console.log('Password updated successfully!')
                })
                .catch(function (error) {
                  console.log(
                    'Failed to update password. Please try again.' +
                      error.message
                  )
                })
            }
          })
          .catch(function (error) {
            // Failed to reauthenticate the user
            console.log('Failed to reauthenticate user: ' + error.message)
          })
      } else {
        console.log('No logged-in user found')
      }
    })
    //
  } else {
    console.log('User data not found in sessionStorage')
  }
})
const logoutBtn = document.getElementById('logout-button')

logoutBtn.addEventListener('click', (event) => {
  event.preventDefault()

  // sign out user from Firebase Authentication
  firebase
    .auth()
    .signOut()
    .then(() => {
      // clear session storage
      sessionStorage.removeItem('user')

      // redirect user to login page
      window.location.href = '/login.html'
      console.log('Userlogged out successful.')
    })
    .catch((error) => {
      console.error(error)

      window.location.href = 'login.html'
    })
})
