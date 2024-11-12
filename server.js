// Import required libraries
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

// Middleware
app.use(bodyParser.json());

// Mock data for OTP storage (use a database in production)
const otpStorage = {};

// Configure Nodemailer for email confirmation
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Your email
    pass: 'your-email-password'    // Your email password or App password
  }
});

// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
  otpStorage[phoneNumber] = otp;

  // Send OTP via SMS (use Twilio or any SMS service here)
  console.log(`OTP for ${phoneNumber}: ${otp}`); // For testing only, replace with SMS API in production

  res.json({ message: 'OTP sent successfully' });
});

// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (otpStorage[phoneNumber] === otp) {
    delete otpStorage[phoneNumber]; // Clear OTP after successful verification
    res.json({ verified: true });
  } else {
    res.json({ verified: false });
  }
});

// Function to send confirmation email
async function sendConfirmationEmail(email) {
  const mailOptions = {
    from: 'your-email@gmail.com', // Your email
    to: email,
    subject: 'Chef Booking Confirmation',
    text: 'Your chef booking has been confirmed. Thank you for using our service!'
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Endpoint to send confirmation email after OTP verification
app.post('/send-confirmation', async (req, res) => {
  const { phoneNumber } = req.body;
  const email = 'user-email@example.com'; // Replace with user's email from database or form input

  const success = await sendConfirmationEmail(email);
  if (success) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
