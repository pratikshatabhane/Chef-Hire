// Import the Twilio library
const twilio = require('twilio');

// Twilio credentials (replace with your own)
const accountSid = 'AC581232efb4c3b7ce9746474cc66663a4';
const authToken = '6140d8183b08546cfbadf662d10407de';
const client = new twilio(accountSid, authToken);

// In-memory store for OTPs (You could use a database like Redis in production)
let otpStore = {};

// Function to generate a random OTP
const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
  return otp;
};

// Function to send OTP via SMS
const sendOTP = (phoneNumber) => {
  const otp = generateOTP();
  otpStore[phoneNumber] = otp; // Store OTP for later verification (temporary storage)

  // Send OTP to user's phone number
  client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: 'your_twilio_phone_number', // Your Twilio phone number
    to: phoneNumber
  }).then(message => {
    console.log('OTP sent successfully: ' + message.sid);
  }).catch(error => {
    console.error('Error sending OTP:', error);
  });
};

// Endpoint to handle OTP request
const express = require('express');
const app = express();
app.use(express.json());

app.post('/send-otp', (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send({ error: 'Phone number is required' });
  }

  sendOTP(phoneNumber);
  res.send({ message: 'OTP sent successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
