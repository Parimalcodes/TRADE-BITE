require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sendMail } = require('./mailService');

const app = express();
app.use(bodyParser.json());

app.post('/send', async (req, res) => {
    const { to, subject, text } = req.body;
    try {
        await sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        res.json({ ok: true });
    } catch (err) {
        // return helpful error to client, log full error server-side
        res.status(500).json({ ok: false, message: 'An error occurred while sending your message. Please try again later.' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));