class MailService {
    constructor(transporter) {
        this.transporter = transporter;
    }

    async sendMail(to, subject, text) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            throw new Error('Error sending email: ' + error.message);
        }
    }
}

export default MailService;