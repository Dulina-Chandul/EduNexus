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
      html: `
      <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Verify Your Account
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
                Welcome! Just one more step to get started
              </p>
            </div>
            
            <!-- Main Content -->
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #2ecc71, #27ae60); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                  </svg>
                </div>
                <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                  Account Verification Required
                </h2>
                <p style="color: #666; margin: 0; font-size: 16px; line-height: 1.6;">
                  To complete your registration and secure your account, please verify your email address by clicking the button below.
                </p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.FRONTEND_URL}/dashboard/verify-account/${token}" 
                   style="display: inline-block; background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4); transition: all 0.3s ease;">
                  Verify Account
                </a>
              </div>
              
              <!-- Security Note -->
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #2ecc71; margin-top: 30px;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  <strong style="color: #2ecc71;">Security tip:</strong> This link will expire in 10 minutes. If you didn't create an account, you can safely ignore this email.
                </p>
              </div>
              
              <!-- Alternative Link -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">
                  Having trouble with the button? Copy and paste this link into your browser:
                </p>
                <p style="color: #2ecc71; font-size: 14px; word-break: break-all; margin: 0;">
                  ${process.env.FRONTEND_URL}/dashboard/verify-account/${token}
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 30px 20px 20px; color: #999; font-size: 14px;">
              <p style="margin: 0 0 5px 0;">
                © 2025 EduNexus. All rights reserved.
              </p>
              <p style="margin: 0;">
                This is an automated message, please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>`,
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
