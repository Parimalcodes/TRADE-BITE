require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// verify connection configuration on startup
transporter.verify((err, success) => {
    if (err) {
        console.error('SMTP verify failed:', err);
    } else {
        console.log('SMTP ready');
    }
});

async function sendMail({ from, to, subject, text, html }) {
    try {
        const info = await transporter.sendMail({ from, to, subject, text, html });
        console.log('Message sent:', info.messageId);
        return info;
    } catch (err) {
        console.error('sendMail error:', err);
        throw err;
    }
}

module.exports = { sendMail };