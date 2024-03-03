const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "johnpaul.rutherford@ethereal.email",
    pass: "MCpbeNNmUnKs3Nrvj9",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(email) {
  const { to, subject, text, html } = email;

  const info = await transporter.sendMail({
    from: '"Haidoc App" <help@haidoc.com>', // sender address
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

// main().catch(console.error);

module.exports = { sendEmail };
