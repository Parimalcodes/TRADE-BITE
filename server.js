const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your Gmail app password
  }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Error configuring email:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { fullname, email, country, countrycode, mobile, company, message } = req.body;

    // Validation
    if (!fullname || !email || !country || !countrycode || !mobile || !company || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address' 
      });
    }

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'tradebite.12@gmail.com',
      subject: `New Contact Form Submission from ${fullname}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Full Name:</strong> ${fullname}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Country Code:</strong> ${countrycode}</p>
            <p><strong>Mobile Number:</strong> ${mobile}</p>
            <p><strong>Company Name:</strong> ${company}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: #ffffff; padding: 15px; border-radius: 5px; border-left: 4px solid #0ea5e9;">
              ${message.replace(/\n/g, '<br>')}
            </p>
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This email was sent from the TRADE BITE website contact form.</p>
            <p>Submitted on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Full Name: ${fullname}
        Email: ${email}
        Country: ${country}
        Country Code: ${countrycode}
        Mobile Number: ${mobile}
        Company Name: ${company}
        
        Message:
        ${message}
        
        Submitted on: ${new Date().toLocaleString()}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to user (optional)
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting TRADE BITE',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0ea5e9;">Thank you for contacting TRADE BITE!</h2>
          <p>Dear ${fullname},</p>
          <p>We have received your enquiry and our team will get back to you shortly.</p>
          <p>Here's a summary of your submission:</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: #ffffff; padding: 10px; border-radius: 5px;">
              ${message.replace(/\n/g, '<br>')}
            </p>
          </div>
          <p>If you have any urgent questions, please feel free to contact us directly at:</p>
          <p><strong>Phone:</strong> +91 9106988001<br>
          <strong>Email:</strong> tradebite.12@gmail.com</p>
          <p>Best regards,<br>TRADE BITE Team</p>
        </div>
      `
    };

    // Send confirmation email (optional - uncomment if you want to send confirmation)
    // await transporter.sendMail(confirmationMailOptions);

    res.json({ 
      success: true, 
      message: 'Your enquiry has been submitted successfully. We will contact you soon.' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while sending your message. Please try again later.' 
    });
  }
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/products.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'products.html'));
});

app.get('/certificates.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'certificates.html'));
});

app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

