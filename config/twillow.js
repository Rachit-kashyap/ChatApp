
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
async function sendEmail(userEmail,otp) {
  try {
    const info = await transporter.sendMail({
      from: `"ChatAPP!" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "OTP Verification",
      text: `This is the Otp ${otp}`,
    });

    console.log("otp sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = sendEmail;
