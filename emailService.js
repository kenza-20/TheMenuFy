const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, message) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,  // Your Gmail address
                pass: process.env.EMAIL_PASS   // Your App Password from Google
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: message
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;
