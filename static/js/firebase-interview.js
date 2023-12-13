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

// Adding new question //
const form = document.getElementById('form')
const addButton = document.getElementById('add-question-button')
let questionCounter = 0
let answerCounter = 0

addButton.addEventListener('click', () => {
  questionCounter++
  answerCounter++
  const form = document.querySelector('form')

  // Create a new input field for question
  const newQuestion = document.createElement('div')
  newQuestion.innerHTML = `
    <div class="d-flex justify-content-center align-items-center">
        <label for="question-${questionCounter}" class="item-label text-success mr-2"><strong>Question ${questionCounter}:</strong></label>
        <input type="text" id="question-${questionCounter}" class="form-control text-center" name="question-${questionCounter}" style="max-width: 700px;" required>
    </div>
  `
  newQuestion
    .querySelector('div')
    .classList.add('d-flex', 'justify-content-center', 'align-items-center')
  newQuestion
    .querySelector(`label[for="question-${questionCounter}"]`)
    .classList.add('mr-2')
  // Add the new question input field to the form
  form.appendChild(newQuestion)

  // Create a new input field for answer
  const newAnswer = document.createElement('div')
  newAnswer.innerHTML = `
    <div class="d-flex justify-content-center align-items-center">
      <label for="answer-${answerCounter}" class="item-label text-success mr-2"><strong>Answer ${answerCounter}:</strong></label>
      <input type="text" id="answer-${answerCounter}" class="form-control text-center" name="answer-${answerCounter}" style="max-width: 700px;" required>
    </div>
  `
  newAnswer
    .querySelector('div')
    .classList.add('d-flex', 'justify-content-center', 'align-items-center')
  newAnswer
    .querySelector(`label[for="answer-${answerCounter}"]`)
    .classList.add('mr-2')
  // Add the new answer input field to the form
  form.appendChild(newAnswer)
})

// Generate Interview Code //
function generateInterviewCode() {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const length = 6
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
function generateCode() {
  document.getElementById('generate-interview-link-button').disabled = true

  const storedCode = localStorage.getItem('interviewCode')
  if (storedCode) {
    document.getElementById('interview-link').textContent = storedCode
  } else {
    const code = generateInterviewCode()
    document.getElementById('interview-link').textContent = code
    // Store the generated code in localStorage
    localStorage.setItem('interviewCode', code)
  }
}

var validation = document.getElementById('validation-start-date')
var validation_2 = document.getElementById('validation-end-date')
var interviewCode

var startDate = document.getElementById('interview-start-date')
var endDate = document.getElementById('interview-end-date')

var questionDuration
var jobTitle
var jobDescription
var interviewerName
var interviewerContact

var interviewHours
var interviewMinutes
var interviewSeconds

var questionHours
var questionMinutes
var questionSeconds

// Input Validations //
startDate.addEventListener('input', (event) => {
  const startDateValue = event.target.value
  const startDate = new Date(startDateValue)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (startDate > today) {
    validation.textContent = ''
  } else {
    validation.textContent = " Start date cannot be less than today's date"
  }
})

endDate.addEventListener('input', (event) => {
  const endDateValue = event.target.value
  const startDateValue = startDate.value
  console.log(startDateValue)

  if (startDateValue && new Date(endDateValue) < new Date(startDateValue)) {
    validation_2.textContent = 'End date cannot be less than start date'
  } else {
    validation_2.textContent = ''
  }
})
//
document
  .getElementById('schedule-interview-button')
  .addEventListener('click', storeFormData)
// Database Connection //
function storeFormData() {
  console.log('Schedule Button Clicked')
  document.getElementById('generate-interview-link-button').disabled = false
  // Get form data
  interviewCode = document.getElementById('interview-link').textContent

  interviewHours =
    parseInt(document.getElementById('interview-hours').value) || 0 // Convert to number, default to 0 if empty
  interviewMinutes =
    parseInt(document.getElementById('interview-minutes').value) || 0
  interviewSeconds =
    parseInt(document.getElementById('interview-seconds').value) || 0
  interviewDuration =
    interviewHours * 3600 + interviewMinutes * 60 + interviewSeconds

  questionHours = parseInt(document.getElementById('question-hours').value) || 0 // Convert to number, default to 0 if empty
  questionMinutes =
    parseInt(document.getElementById('question-minutes').value) || 0
  questionSeconds =
    parseInt(document.getElementById('question-seconds').value) || 0
  questionDuration =
    questionHours * 3600 + questionMinutes * 60 + questionSeconds

  jobTitle = document.getElementById('job-title').value
  jobDescription = document.getElementById('job-description').value
  interviewerName = document.getElementById('interviewer-name').value
  interviewerContact = document.getElementById('interviewer-contact').value

  if (
    interviewCode === '' &&
    startDate.value === '' &&
    endDate.value === '' &&
    jobTitle === '' &&
    jobDescription === '' &&
    interviewerName === '' &&
    interviewerContact === ''
  ) {
    document.getElementById('check-values').textContent =
      'Please fill in all the required fields!'
  } else {
    var questions = []
    var answers = []

    for (let i = 1; i <= questionCounter; i++) {
      const question = document.getElementById(`question-${i}`).value
      questions.push(question)
    }
    for (let i = 1; i <= answerCounter; i++) {
      const answer = document.getElementById(`answer-${i}`).value
      answers.push(answer)
    }

    // Create an interview object with the form data
    var interview = {
      scheduleTime: new Date().toString(),
      startDate: document.getElementById('interview-start-date').value,
      endDate: document.getElementById('interview-end-date').value,
      interviewDuration: interviewDuration,
      questionDuration,
      jobTitle,
      jobDescription,
      interviewerName,
      interviewerContact,
      questions,
      answers,
      interviewCode,
    }

    db.collection('interview-schedule')
      .doc(interviewCode)
      .set(interview)
      .then(() => {
        // Success
        showModal()
        console.log('Interview data stored successfully in Firestore')
        localStorage.removeItem('interviewCode')
        //form.reset();
      })
      .catch((error) => {
        console.error('Error storing interview data in Firestore:', error)
      })
  }
}

// Show modal if interview Success //

function showModal() {
  interviewCode = document.getElementById('interview-link').textContent
  startDate = document.getElementById('interview-start-date').value
  endDate = document.getElementById('interview-end-date').value
  interviewHours =
    parseInt(document.getElementById('interview-hours').value) || 0 // Convert to number, default to 0 if empty
  interviewMinutes =
    parseInt(document.getElementById('interview-minutes').value) || 0
  interviewSeconds =
    parseInt(document.getElementById('interview-seconds').value) || 0
  interviewDuration =
    interviewHours * 3600 +
    ' : ' +
    interviewMinutes * 60 +
    ' : ' +
    interviewSeconds

  questionHours = parseInt(document.getElementById('question-hours').value) || 0 // Convert to number, default to 0 if empty
  questionMinutes =
    parseInt(document.getElementById('question-minutes').value) || 0
  questionSeconds =
    parseInt(document.getElementById('question-seconds').value) || 0
  questionDuration =
    questionHours * 3600 +
    ' : ' +
    questionMinutes * 60 +
    ' : ' +
    questionSeconds

  jobTitle = document.getElementById('job-title').value
  jobDescription = document.getElementById('job-description').value
  interviewerName = document.getElementById('interviewer-name').value
  interviewerContact = document.getElementById('interviewer-contact').value

  // Populate the modal with the values
  document.getElementById('modal-title').textContent =
    'Interview Scheduled Successfully!'
  document.getElementById('modal-interview-code').textContent =
    ' ' + interviewCode
  document.getElementById('modal-start-date').textContent = startDate
  document.getElementById('modal-end-date').textContent = endDate
  document.getElementById('modal-duration').textContent = interviewDuration
  document.getElementById('modal-question-duration').textContent =
    questionDuration
  document.getElementById('modal-job-title').textContent = jobTitle
  document.getElementById('modal-job-description').textContent = jobDescription
  document.getElementById('modal-interviewer-name').textContent =
    interviewerName
  document.getElementById('modal-interviewer-contact').textContent =
    interviewerContact

  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('interview-modal'))
  modal.show()
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
