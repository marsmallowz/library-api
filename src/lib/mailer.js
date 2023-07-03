const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
  host: "smtp.gmail.com",
  service: "gmail",
});

const mailer = async ({ subject, html, to, text }) => {
  await transport.sendMail({
    subject: subject || "test subject email",
    html: html || "<h1>This is sent through express API</h1>",
    to: to || "bestbrotherdan@gmail.com",
    text: text || "test nodemailer",
  });
};

module.exports = mailer;
