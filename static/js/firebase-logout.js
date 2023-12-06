const userDetails = JSON.parse(sessionStorage.getItem('user'))

// FOR LOG OUT //
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
