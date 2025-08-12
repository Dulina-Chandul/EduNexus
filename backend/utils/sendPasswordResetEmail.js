import nodemailer from "nodemailer";

const sendPasswordResetEmail = async (to, resetToken) => {
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
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password:</p>
                   <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">Reset Password</a>`,
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

export default sendPasswordResetEmail;
