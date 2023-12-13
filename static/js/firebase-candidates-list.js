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

var dbstatus = document.getElementById('database-response')
const candidatesBody = document.getElementById('candidate-list')

function fetchCandidates() {
  const interviewCode = document.getElementById('interview-code').value

  candidatesBody.innerHTML = ''
  let candidateData
  var counter = 0

  db.collection('candidates')
    .where('InterviewCode', '==', interviewCode)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        console.log('List Displayed')
        querySnapshot.forEach((doc) => {
          candidateData = doc.data()
          fetchJobTitle(candidateData.InterviewCode)
          const row = document.createElement('tr')
          const sno = document.createElement('td')
          const name = document.createElement('td')
          const email = document.createElement('td')
          const contact = document.createElement('td')
          const jobCode = document.createElement('td')
          const time = document.createElement('td')
          const report = document.createElement('a')

          sno.textContent = ++counter // Assuming only one candidate per document
          name.textContent = candidateData.CandidateName
          email.textContent = candidateData.CandidateEmail
          contact.textContent = candidateData.CandidateContact
          jobCode.textContent = candidateData.InterviewCode
          time.textContent = candidateData.interviewTime
          report.textContent = 'View Report'

          // Set attributes using the dataset property
          report.dataset.name = candidateData.CandidateName
          report.dataset.email = candidateData.CandidateEmail
          report.dataset.contact = candidateData.CandidateContact
          report.dataset.jobCode = candidateData.InterviewCode
          report.dataset.time = candidateData.interviewTime

          // Set the href attribute with query parameters
          report.href = `candidate-report.html?name=${encodeURIComponent(
            report.dataset.name
          )}&email=${encodeURIComponent(
            report.dataset.email
          )}&contact=${encodeURIComponent(
            report.dataset.contact
          )}&jobCode=${encodeURIComponent(
            report.dataset.jobCode
          )}&time=${encodeURIComponent(report.dataset.time)}`

          // Set target attribute to open in a new tab
          report.target = '_blank' // Opens in a new tab

          row.appendChild(sno)
          row.appendChild(name)
          row.appendChild(email)
          row.appendChild(contact)
          row.appendChild(jobCode)
          row.appendChild(time)
          row.appendChild(report)

          candidatesBody.appendChild(row)
        })
      } else {
        console.log('No candidates found for the given interview code.')
      }
    })
    .catch((error) => {
      console.log('Error fetching candidates:', error)
    })
}

// Function to search candidates by name
function searchCandidate() {
  // Get the input value for candidate name
  var searchCandidateName = document
    .getElementById('search-list')
    .value.toLowerCase()
  console.log('search button clicked')
  const candidatesBody = document.getElementById('candidate-list')
  // Loop through each row in the table body
  for (var i = 0; i < candidatesBody.rows.length; i++) {
    var row = candidatesBody.rows[i]

    // Get the candidate name in the current row
    var candidateName = row.cells[1].innerText.toLowerCase()

    // Compare the search input with the candidate name
    if (candidateName.includes(searchCandidateName)) {
      // If the candidate name matches, display the row
      row.style.display = ''
    } else {
      // If the candidate name does not match, hide the row
      row.style.display = 'none'
    }
  }
}

// Fetching Job Title
function fetchJobTitle(interviewCode) {
  db.collection('interview-schedule')
    .doc(interviewCode)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        // Get the job title from the document data
        dbstatus.textContent =
          'Displaying records for job: ' + doc.data().jobTitle
      } else {
        console.log('No job found')
      }
    })
    .catch((error) => {
      console.log('Error fetching job:', error)
    })
}
// Downloading .CSV

// Function to download the candidates as .csv file
function downloadCSV() {
  // Get the candidates table
  console.log('List Download Clicked')
  var table = document.getElementById('candidate-table')

  // Get the table headers
  var headers = Array.from(table.getElementsByTagName('th')).map(
    (th) => th.innerText
  )

  // Get the table rows
  var rows = Array.from(table.getElementsByTagName('tr'))

  // Create an array to hold the .csv data
  var csvData = []

  // Add the headers to the .csv data
  csvData.push(headers.join(','))

  // Add the data from the table rows to the .csv data
  rows.forEach(function (row) {
    var rowData = Array.from(row.getElementsByTagName('td')).map(
      (td) => td.innerText
    )
    csvData.push(rowData.join(','))
  })

  // Convert the .csv data to a string
  var csvString = csvData.join('\n')

  // Create a Blob with the .csv data
  var blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' })

  // Create a download link
  var downloadLink = document.createElement('a')
  downloadLink.href = URL.createObjectURL(blob)
  downloadLink.download = 'candidates.csv'

  // Append the download link to the document and trigger the download
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}
const logoutBtn = document.getElementById('logout-button')

logoutBtn.addEventListener('click', (event) => {
  event.preventDefault()
  console.log('Logout clicked')
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
      console.log(error)

      window.location.href = 'login.html'
    })
})
