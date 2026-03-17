const nodemailer = require("nodemailer");
const env = require("dotenv");

env.config();

export async function sendRandomMail(email: string) {
  var randompassword = generatePassword();
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
    text: `Your Password is ${randompassword}`,
    html: `<b>  <h4 >Your Password  ${randompassword}</h4>    <br>  <a href="">Click here</a></b>`,
  });

  return randompassword;
}

function generatePassword() {
  const digits = "1234567890";
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const specialCharacters = "!@#$%^&*()_+[]{}|;:,.<>?";
  
  const allCharacters = digits + lowerCaseLetters + upperCaseLetters + specialCharacters;
  let password = "";
  
  for (let i = 0; i < 6; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }
  
  return password;
}