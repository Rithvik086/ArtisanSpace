import dotenv from "dotenv";
import mail from "nodemailer";

dotenv.config();

const transporter = mail.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    authMethod: "PLAIN",
  },
});

export const sendMail = async (email, subject, msg) => {
  try {
    const mailOptions = {
      from: "artisanspace09@gmail.com",
      to: email,
      subject: subject,
      text: msg,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info.response;
  } catch (error) {
    console.log("Error sending mail: ", error);
    throw new Error("Error sending mail");
  }
};
