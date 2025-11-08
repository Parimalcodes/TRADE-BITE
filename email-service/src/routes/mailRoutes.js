const express = require('express');
const MailController = require('../controllers/mailController');

const setMailRoutes = (app) => {
    const router = express.Router();
    const mailController = new MailController();

    router.post('/send', mailController.sendMail.bind(mailController));

    app.use('/api/mail', router);
};

module.exports = setMailRoutes;