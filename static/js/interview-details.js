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

// Elements from HTML //
const verifyButton = document.getElementById('verify-button')

const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const startButton = document.getElementById('start-video-button')
const stopButton = document.getElementById('stop-video-button')
const nextButton = document.getElementById('next-question-button')

const interviewCodeSection = document.getElementById('interview-code-section')
const userDataSection = document.getElementById('user-data-section')
const videoSection = document.getElementById('video-section')

var interviewCodeInput = document.getElementById('code-verify-input')
const verifyCodeButton = document.getElementById('verify-code-button')
var databaseResponse = document.getElementById('verify-code-database')
var spinner = document.getElementById('spinner-mode')

const userAgreementSection = document.getElementById('user-agreement-section')
var agreeCheckbox = document.getElementById('agree-checkbox')
var proceedButton = document.getElementById('proceed-button')

var storeDatabaseResponse = document.getElementById('store-user-database')

var spinner2 = document.getElementById('spinner-mode-2')
var startInterviewButton = document.getElementById('start-interview-button')

var timerElement = document.getElementById('total-timer')
var questionTimer = document.getElementById('question-timer')

var questionDisplay = document.getElementById('question-display')

// Display Function //
verifyCodeButton.addEventListener('click', function (event) {
  event.preventDefault()

  verifyCodeButton.style.display = 'none'
  spinner.style.display = 'block'

  db.collection('interview-schedule')
    .where('interviewCode', '==', interviewCodeInput.value.trim())
    .get()
    .then(function (querySnapshot) {
      if (querySnapshot.size > 0) {
        databaseResponse.textContent = 'Success!'
        console.log('Interview   matches')
        setTimeout(function () {
          interviewCodeSection.style.display = 'none'
          userAgreementSection.style.display = 'block'
        }, 1000)
      } else {
        verifyCodeButton.style.display = 'block'
        spinner.style.display = 'none'
        databaseResponse.textContent = 'Invalid Code!'
        console.log('Interview code does not exist.')
      }
    })
    .catch(function (error) {
      console.error('Error querying Firebase collection: ', error)
    })
})

// User Agreement Section //
document.addEventListener('DOMContentLoaded', function () {
  // Add an event listener to the checkbox
  agreeCheckbox.addEventListener('change', function () {
    proceedButton.disabled = !agreeCheckbox.checked
  })
  proceedButton.addEventListener('click', function () {
    if (agreeCheckbox.checked) {
      userAgreementSection.style.display = 'none'
      userDataSection.style.display = 'block'
    }
  })
})

// User Data Section //
let interviewDuration = 0 // in seconds
var timerInterval
var questiontimerInterval

let candidateNameInput

startInterviewButton.addEventListener('click', function (event) {
  event.preventDefault()
  storeDatabaseResponse.textContent = ''
  const candidateName = document.getElementById('candidate-name').value
  const candidateEmail = document.getElementById('candidate-email').value
  const candidateContact = document.getElementById('candidate-contact').value

  candidateNameInput = candidateName

  var documentTitle = candidateName + '_' + interviewCodeInput.value

  spinner.style.display = 'block'
  if (
    candidateName &&
    candidateName.trim() !== '' &&
    candidateEmail &&
    candidateEmail.trim() !== '' &&
    candidateContact &&
    candidateContact.trim() !== ''
  ) {
    db.collection('candidates')
      .where('CandidateEmail', '==', candidateEmail)
      .where('InterviewCode', '==', interviewCodeInput.value)
      .get()
      .then((querySnapshot) => {
        // If a document with the same email address is found, prevent adding a new document
        if (!querySnapshot.empty) {
          storeDatabaseResponse.textContent =
            'A candidate with the same email address already exists.'
        } else {
          db.collection('candidates')
            .doc(documentTitle)
            .set({
              interviewTime: new Date().toString(),
              CandidateName: candidateName,
              CandidateEmail: candidateEmail,
              CandidateContact: candidateContact,
              InterviewCode: interviewCodeInput.value,
            })
            .then(() => {
              storeDatabaseResponse.textContent =
                'Candidate data stored successfully!'
              setTimeout(function () {
                userDataSection.style.display = 'none'
                videoSection.style.display = 'block'
              }, 1000)
              console.log('Document successfully written to Firestore!')
            })
            .catch((error) => {
              storeDatabaseResponse.textContent = 'Error: ' + error
              console.error('Error writing document to Firestore: ', error)
            })
        }
      })
      .catch((error) => {
        console.error('Error querying Firestore: ', error)
      })
  } else {
    storeDatabaseResponse.textContent = 'Please fill the fields!'
  }
})

// General Functions
$(document).ready(function () {
  $('#interviewCodeModal').modal('show')
})

interviewCodeInput.addEventListener('input', (event) => {
  const inputValue = event.target.value
  event.target.value = inputValue.toUpperCase()
})
interviewCodeInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    // Check if "Enter" key is pressed
    event.preventDefault() // Prevent default behavior of "Enter" key (e.g., form submission)
    verifyButton.click() // Trigger the "Verify" button click event
  }
})
// Video recording //

// Set constraints for video
const constraints = {
  audio: true,
  video: {
    width: 640,
    height: 480,
  },
}

// Listen for start button click and start recording
let stream
startButton.addEventListener('click', () => {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediaStream) => {
      stream = mediaStream
      video.srcObject = stream
      startRecording(interviewCodeInput.value)
    })
    .catch((err) => console.log(err))
})

// Draw video frames onto canvas and convert to base64-encoded image
const captureFrame = () => {
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
  const dataURL = canvas.toDataURL('image/png')
  return dataURL.split(',')[1]
}

// Video Functions //

// Function to start recording video
let recorder
let questionStartTime
let currentQuestionNumber = 1

function startRecording(code) {
  // Fetch interview duration from Firestore
  db.collection('interview-schedule')
    .doc(code)
    .get()
    .then((doc) => {
      if (doc.exists) {
        totalCountdown(parseInt(doc.data().interviewDuration))
        questionDuration = parseInt(doc.data().questionDuration)
        displayQuestions()
        startNextQuestionRecording()
      } else {
        console.log('No such document!')
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error)
    })
}

function startNextQuestionRecording() {
  // Record video for the current question
  recorder = new MediaRecorder(stream)
  recorder.start()
  questionStartTime = new Date().getTime()
  console.log('Recording started for question ' + currentQuestionNumber)

  // Stop recording and send video to server when question duration is elapsed
  setTimeout(() => {
    recorder.stop()
    console.log('Recording stopped for question ' + currentQuestionNumber)
    recorder.ondataavailable = (event) => {
      let videoBlob = event.data
      uploadVideo(candidateNameInput, currentQuestionNumber, videoBlob)
    }
    currentQuestionNumber++

    // If there are more questions, start recording for the next question
    if (currentQuestionNumber <= totalQuestions) {
      startNextQuestionRecording()
    }
  }, questionDuration * 1000)
}
// Listen for stop button click and stop recording
//stopButton.addEventListener('click', stopRecording());

// Function to stop recording video
function stopRecording() {
  if (recorder && recorder.state === 'recording') {
    // Add null check for recorder
    recorder.stop()
    stream.getTracks().forEach((track) => track.stop())
    clearInterval(timerInterval)

    // Upload the last recorded video for the current question
    recorder.ondataavailable = (event) => {
      let videoBlob = event.data
      uploadVideo(candidateNameInput.value, currentQuestionNumber, videoBlob)
    }
  } else {
    console.log('Recorder Not initialized.')
  }
}

// Total time Countdown
function totalCountdown(parsedDuration) {
  var minutes = Math.floor(parsedDuration / 60) // calculate minutes
  var seconds = parsedDuration % 60 // calculate seconds

  var countDownDate = new Date()
  countDownDate.setMinutes(countDownDate.getMinutes() + minutes)
  countDownDate.setSeconds(countDownDate.getSeconds() + seconds)

  timerInterval = setInterval(function () {
    var now = new Date().getTime()
    var distance = countDownDate - now
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    var seconds = Math.floor((distance % (1000 * 60)) / 1000)
    timerElement.innerHTML = minutes + 'm ' + seconds + 's '

    var tenPercentTime = parsedDuration * 0.1 * 1000
    // Change color to 'text-danger' when 10% time is left
    if (distance < tenPercentTime) {
      timerElement.classList.add('text-danger')
    }

    if (distance < 0) {
      clearInterval(timerInterval)
      timerElement.classList.add('text-danger')
      timerElement.innerHTML = 'TIME ELAPSED'
    }
  }, 1000)
}
// Question time Countdown
function questionCountdown(parsedQuestionDuration) {
  startButton.disabled = true
  var minutes = Math.floor(parsedQuestionDuration / 60) // calculate minutes
  var seconds = parsedQuestionDuration % 60 // calculate seconds

  var countDownDate = new Date()
  countDownDate.setMinutes(countDownDate.getMinutes() + minutes)
  countDownDate.setSeconds(countDownDate.getSeconds() + seconds)

  questiontimerInterval = setInterval(function () {
    var now = new Date().getTime()
    var distance = countDownDate - now
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    var seconds = Math.floor((distance % (1000 * 60)) / 1000)
    questionTimer.innerHTML = minutes + 'm ' + seconds + 's '

    var tenPercentTime = parsedQuestionDuration * 0.1 * 1000
    // Change color to 'text-danger' when 10% time is left
    if (distance < tenPercentTime) {
      questionTimer.classList.add('text-danger')
    }

    if (distance < 0) {
      clearInterval(questiontimerInterval)
      questionTimer.classList.add('text-danger')
      questionTimer.innerHTML = 'TIME ELAPSED'
      //stopRecording();
    }
  }, 1000)
}
function displayQuestions() {
  const interviewCode = interviewCodeInput.value
  const questions = getQuestionsFromInterviewCode(interviewCode) // Replace with your actual function to retrieve questions from database
  //console.log(questions);
  const questionDisplayElement = document.getElementById('question-display')
  const nextQuestionBtn = document.getElementById('next-question-button')

  let currentQuestionIndex = 0 // Track the current question index

  // Function to display the current question and start question countdown
  function displayCurrentQuestion() {
    // Use .then() to access the resolved value of the Promise
    questions
      .then((questionsArray) => {
        // Check if there are no more questions
        if (currentQuestionIndex >= questionsArray.length) {
          questionDisplayElement.textContent =
            "Interview Completed! Please click on 'Submit Interview' to proceed." // Display "Interview Completed" message
          questionDisplayElement.classList.add(
            'text-primary',
            'font-weight-bold'
          )
          nextQuestionBtn.disabled = true
          //stopRecording();
          return
        }

        // Display the current question
        const currentQuestion = questionsArray[currentQuestionIndex]
        questionDisplayElement.textContent = `Question ${
          currentQuestionIndex + 1
        } of ${questionsArray.length}: ${currentQuestion}` // Update with the actual property name of the question object

        // Call questionCountdown function for the current question
        questionCountdown(questionDuration) // Replace with your actual function to start question countdown

        // Increment the current question index
        currentQuestionIndex++
      })
      .catch((error) => {
        console.error(`Error fetching questions: ${error}`)
      })
  }

  // Add click event listener to the 'Next Question' button
  nextQuestionBtn.addEventListener('click', function () {
    displayCurrentQuestion() // Display the next question
    recorder.stop()
    clearInterval(questiontimerInterval)
    clearInterval(timerInterval)
  })

  // Display the first question when the function is called
  displayCurrentQuestion()
}
//
function getQuestionsFromInterviewCode(interviewCode) {
  // Replace 'interviewCodeInput.value' with your actual code to get the interview code input value
  return db
    .collection('interview-schedule')
    .doc(interviewCode)
    .get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        const data = docSnapshot.data()
        // Check if the 'questions' field exists in the retrieved document
        if (data.questions && Array.isArray(data.questions)) {
          // Check if the 'questions' array is not empty
          if (data.questions.length > 0) {
            // Return the 'questions' array from the retrieved document
            console.log(data.questions)
            return data.questions
          } else {
            console.warn(
              `'questions' field found but array is empty in document with interview code ${interviewCode}`
            )
            return [] // Return an empty array if 'questions' array is empty
          }
        } else {
          console.error(
            `'questions' field not found in document with interview code ${interviewCode}`
          )
          return [] // Return an empty array if 'questions' field not found
        }
      } else {
        console.error(`Document not found with interview code ${interviewCode}`)
        return [] // Return an empty array if document not found
      }
    })
    .catch((error) => {
      console.error(
        `Error fetching document with interview code ${interviewCode}`,
        error
      )
      return [] // Return an empty array if any error occurs
    })
}

// Sending Video to Server (Node.js)

// Function to handle video file upload
function uploadVideo(candidateName, questionNumber, videoBlob) {
  // Convert videoBlob to Blob URL for server-side handling
  let videoUrl = URL.createObjectURL(videoBlob)

  // Construct the request body
  let requestBody = {
    candidateName: candidateName,
    questionNumber: questionNumber,
    videoUrl: videoUrl,
  }

  // Use Fetch API to send video data to the server
  fetch('/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (response.ok) {
        console.log(
          `Video for question ${questionNumber} uploaded successfully.`
        )
      } else {
        console.log(`Failed to upload video for question ${questionNumber}.`)
      }
    })
    .catch((error) => console.log(error))
}
