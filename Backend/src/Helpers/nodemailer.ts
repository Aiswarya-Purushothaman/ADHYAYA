const nodemailer = require("nodemailer");
const env = require("dotenv");

env.config();

export async function sendMail(email: string) {
  var otp = generateOtp();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Verify Your Account ✔",
    text: `Your OTP is ${otp}`,
    html: `<b>  <h4 >Your OTP  ${otp}</h4>    <br>  <a href="">Click here</a></b>`,
  });

  return otp;
}

function generateOtp() {
  const digits = "1234567890";
  var otp = "";
  for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}
