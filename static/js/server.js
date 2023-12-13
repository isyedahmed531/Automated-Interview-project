// Import necessary modules
const express = require('express');
const multer = require('multer');
const path = require('path');

// Create Express app
const app = express();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder where you want to store the uploaded videos
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename for the uploaded video
  }
});
const upload = multer({ storage });

// Define a POST route to handle video file upload
app.post('/upload', upload.single('video'), (req, res) => {
  // Handle the uploaded file
  // File will be available in req.file
  // Access other form fields, such as candidate name or question number, from req.body
  
  // Example: Store the file path in a database or perform other operations
  const filePath = path.join('uploads', req.file.filename); // Get the file path
  const candidateName = req.body.candidateName; // Get the candidate name from form field
  const questionNumber = req.body.questionNumber; // Get the question number from form field
  // Save the filePath, candidateName, and questionNumber in your database or perform other operations as needed
  
  // Send response to client
  res.status(200).json({
    message: 'File uploaded successfully',
    filePath: filePath,
    candidateName: candidateName,
    questionNumber: questionNumber
  });
});

// Start the Express server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
