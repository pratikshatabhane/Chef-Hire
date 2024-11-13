// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chef-booking', { useNewUrlParser: true, useUnifiedTopology: true });

// Schema for booking and OTP
const bookingSchema = new mongoose.Schema({
    service: String,
    date: String,
    phone: String,
    otp: String,
    otpVerified: { type: Boolean, default: false }
});
const Booking = mongoose.model('Booking', bookingSchema);

// OTP generation
app.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await Booking.findOneAndUpdate({ phone }, { otp }, { upsert: true });

    // (Optional) Send OTP via SMS/email
    console.log(`OTP for ${phone} is ${otp}`);

    res.json({ success: true });
});

// OTP verification
app.post('/verify-otp', async (req, res) => {
    const { otp } = req.body;
    const booking = await Booking.findOne({ otp });

    if (booking) {
        booking.otpVerified = true;
        await booking.save();
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Booking endpoint
app.post('/book-service', async (req, res) => {
    const { service, date, phone } = req.body;
    const booking = await Booking.findOne({ phone, otpVerified: true });

    if (booking) {
        booking.service = service;
        booking.date = date;
        await booking.save();
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'OTP not verified' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
