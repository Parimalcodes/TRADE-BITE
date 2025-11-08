class MailController {
    constructor(mailService) {
        this.mailService = mailService;
    }

    async sendMail(req, res) {
        const { to, subject, text } = req.body;

        try {
            await this.mailService.sendEmail(to, subject, text);
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to send email', error: error.message });
        }
    }
}

export default MailController;