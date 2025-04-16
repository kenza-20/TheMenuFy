const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

const sendSMS = async ({ to, body }) => {
  await client.messages.create({
    body,
    from: twilioNumber,
    to
  });
};

module.exports = sendSMS;
