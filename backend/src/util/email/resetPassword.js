import nodemailer from "nodemailer";

const sendPasswordResetEmail = async (user, resetPasswordURL) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.RENTERS_SMPT_MAIL,
            pass: process.env.RENTERS_SMPT_MAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.RENTERS_SMPT_MAIL,
        to: user.email,
        subject: "Reset Your Password - EasyRent 🔐",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 40px 20px;
            text-align: center;
            position: relative;
        }
        .logo-container {
            margin-bottom: 20px;
        }
        .logo {
            width: 180px;
            height: auto;
            animation: fadeInDown 1s ease-out;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            animation: fadeInUp 1s ease-out;
        }
        .lock-icon {
            font-size: 60px;
            margin: 20px 0;
            animation: shake 2s ease-in-out infinite;
        }
        .content {
            padding: 40px 30px;
            color: #333333;
            line-height: 1.8;
        }
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #f5576c;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #555555;
            margin-bottom: 15px;
        }
        .alert-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .alert-box p {
            margin: 0;
            color: #856404;
            font-weight: 500;
        }
        .info-box {
            background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
            border-left: 4px solid #00acc1;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .info-box p {
            margin: 5px 0;
            color: #006064;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            padding: 18px 50px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            text-align: center;
            text-decoration: none;
            font-size: 18px;
            font-weight: 700;
            border-radius: 30px;
            margin: 25px 0;
            box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
            transition: all 0.3s ease;
        }
        .security-note {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .security-note h3 {
            color: #f5576c;
            font-size: 18px;
            margin-bottom: 10px;
        }
        .security-note ul {
            margin: 10px 0 0 20px;
            color: #555;
        }
        .security-note li {
            margin: 8px 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px 20px;
            text-align: center;
        }
        .footer-text {
            font-size: 14px;
            color: #888888;
            margin: 5px 0;
        }
        .footer-brand {
            font-size: 16px;
            font-weight: 700;
            color: #f5576c;
            margin: 10px 0;
        }
        .support-link {
            display: inline-block;
            margin: 15px 0;
            padding: 10px 25px;
            background-color: #ffffff;
            border: 2px solid #f5576c;
            color: #f5576c;
            text-decoration: none;
            border-radius: 20px;
            font-weight: 600;
        }
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes shake {
            0%, 100% {
                transform: rotate(0deg);
            }
            10%, 30%, 50%, 70%, 90% {
                transform: rotate(-5deg);
            }
            20%, 40%, 60%, 80% {
                transform: rotate(5deg);
            }
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            .greeting {
                font-size: 20px;
            }
            .message {
                font-size: 14px;
            }
            .cta-button {
                padding: 16px 35px;
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="header">
            <div class="logo-container">
                <img
                    src="https://res.cloudinary.com/dyiijtk2j/image/upload/v1723660190/rentersLogo_mpe44j.png"
                    alt="EasyRent Logo"
                    class="logo"
                />
            </div>
            <div class="lock-icon">🔐</div>
            <h1>Password Reset Request</h1>
        </div>
        
        <div class="content">
            <p class="greeting">Hello ${user.name},</p>
            
            <p class="message">
                We received a request to reset the password for your <strong>EasyRent</strong> account. Don't worry, we've got you covered!
            </p>
            
            <p class="message">
                To reset your password, simply click the button below. This link will expire in <strong>10 minutes</strong> for security purposes.
            </p>
            
            <center>
                <a href="https://easyrent-red.vercel.app/reset/${resetPasswordURL}" class="cta-button">Reset My Password</a>
            </center>
            
            <div class="alert-box">
                <p>⚠️ <strong>Important:</strong> If you didn't request this password reset, please ignore this email. Your account is safe and no changes have been made.</p>
            </div>
            
            <div class="info-box">
                <p><strong>🔒 Security Link Details:</strong></p>
                <p>• Valid for: 10 minutes only</p>
                <p>• One-time use: Link becomes invalid after use</p>
                <p>• Secure: Encrypted end-to-end</p>
            </div>
            
            <div class="security-note">
                <h3>🛡️ Password Security Tips:</h3>
                <ul>
                    <li>Use at least 8 characters with a mix of letters, numbers, and symbols</li>
                    <li>Avoid using personal information or common words</li>
                    <li>Don't reuse passwords from other accounts</li>
                    <li>Consider using a password manager</li>
                </ul>
            </div>
            
            <p class="message" style="margin-top: 30px;">
                If the button above doesn't work, copy and paste this link into your browser:
            </p>
            <p class="message" style="word-break: break-all; color: #007bff;">
                https://easyrent-red.vercel.app/reset/${resetPasswordURL}
            </p>
            
            <p class="message" style="margin-top: 30px;">
                <strong>Need help?</strong> Our support team is here for you 24/7.
            </p>
            
            <center>
                <a href="mailto:techpraveer@gmail.com" class="support-link">Contact Support</a>
            </center>
        </div>
        
        <div class="footer">
            <p class="footer-brand">EasyRent</p>
            <p class="footer-text">Your security is our top priority</p>
            <p class="footer-text" style="margin-top: 15px;">
                This is an automated email. Please do not reply to this message.
            </p>
            <p class="footer-text">Developed with ❤️ by Praveer</p>
            <p class="footer-text">© 2024 EasyRent. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Password reset email sent successfully!");
    });
};

export default sendPasswordResetEmail;
