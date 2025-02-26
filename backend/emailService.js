const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: htmlContent,  // Ensure we use 'html' instead of 'text'
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
