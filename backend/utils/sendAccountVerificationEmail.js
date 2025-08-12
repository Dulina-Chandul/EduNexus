import nodemailer from "nodemailer";

const sendAccountVerificationEmail = async (to, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //* Email options
    const message = {
      to,
      subject: "Account Verification",
      html: `<p>Click the link below to verify your account:</p>
                   <a href="${process.env.FRONTEND_URL}/dashboard/verify-account/${token}">Verify Account</a>`,
    };

    //* Send email
    const info = await transporter.sendMail(message);
    console.log("Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send account verification email");
  }
};

export default sendAccountVerificationEmail;
