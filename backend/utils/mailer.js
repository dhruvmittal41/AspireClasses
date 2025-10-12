const nodemailer = require("nodemailer");

// Create a transporter object using the default SMTP transport
// This object is responsible for the actual sending of the email.
const transporter = nodemailer.createTransport({
    host: "smtp.your-email-provider.com", // Your web host's SMTP server address
    port: 587, // Common port for SMTP with STARTTLS. Use 465 for SSL.
    secure: false, // true for port 465, false for other ports like 587
    auth: {
        user: process.env.EMAIL_USER, // Your email address from the .env file
        pass: process.env.EMAIL_PASS, // Your email password from the .env file
    },
});

/**
 * Sends a pre-formatted OTP email.
 * @param {string} email - The recipient's email address.
 * @param {string} otp - The 6-digit One-Time Password.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 */
const sendOtpEmail = async (email, otp) => {
    // Define the email options
    const mailOptions = {
        from: `"AspireClasses" <${process.env.EMAIL_USER}>`, // Sender's name and email
        to: email, // Recipient's email
        subject: "Your One-Time Password (OTP) for Verification", // Email subject
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
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`OTP email successfully sent to ${email}`);
    } catch (error) {
        console.error("Error sending OTP email:", error);
        // Throw an error to be caught by the controller's error handler
        throw new Error("Could not send OTP email. Please try again later.");
    }
};

module.exports = { sendOtpEmail };