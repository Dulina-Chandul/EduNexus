import nodemailer from "nodemailer";

const sendNotificationEmail = async (to, postId) => {
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
      subject: "New post created",
      html: `<p>A new post has been created. Click the link below to view it:</p>
                   <a href="${process.env.FRONTEND_URL}/post/${postId}">View Post</a>`,
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

export default sendNotificationEmail;
