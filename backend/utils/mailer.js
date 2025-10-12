const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
  @param {string} email 
  @param {string} otp 
  @returns {Promise<void>}
 */
const sendOtpEmail = async (email, otp) => {

  const mailOptions = {
    from: `"AspireClasses" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your One-Time Password (OTP) for Verification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="text-align: center; color: #333;">OTP Verification</h2>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">Thank you for registering. Please use the following One-Time Password (OTP) to complete your account setup:</p>
        <p style="text-align: center; font-size: 24px; font-weight: bold; color: #444; letter-spacing: 4px; padding: 10px; background-color: #f2f2f2; border-radius: 5px;">
          ${otp}
        </p>
        <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        <hr style="border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 16px;">Best Regards,<br/>The AspireClasses Team</p>
      </div>
    `,
  };

  try {

    await transporter.sendMail(mailOptions);
    console.log(`OTP email successfully sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);

    throw new Error("Could not send OTP email. Please try again later.");
  }
};

module.exports = { sendOtpEmail };