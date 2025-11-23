import nodemailer from "nodemailer";

const sendWelcomeEmail = async (newUser) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.RENTERS_SMPT_MAIL,
      pass: process.env.RENTERS_SMPT_MAIL_PASSWORD,
    },
  });

  const emailContent = `
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        .welcome-icon {
            font-size: 60px;
            margin: 20px 0;
            animation: bounce 2s infinite;
        }
        .content {
            padding: 40px 30px;
            color: #333333;
            line-height: 1.8;
        }
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #667eea;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #555555;
            margin-bottom: 15px;
        }
        .highlight-box {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-left: 4px solid #667eea;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .highlight-box p {
            margin: 0;
            color: #333;
            font-weight: 500;
        }
        .features {
            margin: 30px 0;
        }
        .feature-item {
            display: flex;
            align-items: center;
            margin: 15px 0;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            transition: transform 0.3s ease;
        }
        .feature-icon {
            font-size: 24px;
            margin-right: 15px;
            color: #667eea;
        }
        .cta-button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
            border-radius: 30px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: transform 0.3s ease;
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
            color: #667eea;
            margin: 10px 0;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
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
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
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
            <div class="welcome-icon">🎉</div>
            <h1>Welcome to EasyRent!</h1>
        </div>
        
        <div class="content">
            <p class="greeting">Hello ${newUser.name}! 👋</p>
            
            <p class="message">
                We're absolutely thrilled to have you join the <strong>EasyRent</strong> community! Your journey to finding the perfect rental home starts here.
            </p>
            
            <div class="highlight-box">
                <p>✨ Your account has been successfully created and is ready to use!</p>
            </div>
            
            <div class="features">
                <div class="feature-item">
                    <span class="feature-icon">🏠</span>
                    <div>
                        <strong>Browse Properties</strong> - Explore thousands of verified rental listings
                    </div>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">💬</span>
                    <div>
                        <strong>Connect with Owners</strong> - Direct communication with property owners
                    </div>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">⭐</span>
                    <div>
                        <strong>Save Favorites</strong> - Keep track of properties you love
                    </div>
                </div>
            </div>
            
            <p class="message">
                Our platform is designed to make your rental search easy, secure, and hassle-free. If you need any assistance, our support team is always here to help!
            </p>
            
            <center>
                <a href="https://easyrent-red.vercel.app" class="cta-button">Start Exploring</a>
            </center>
            
            <p class="message" style="margin-top: 30px;">
                Thank you for choosing EasyRent. We're excited to help you find your perfect home! 🏡
            </p>
            
            <p class="message">
                <strong>Warm regards,</strong><br>
                The EasyRent Team
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-brand">EasyRent</p>
            <p class="footer-text">Making rental searching easy and accessible for everyone</p>
            <p class="footer-text">Developed with ❤️ by Praveer</p>
            <p class="footer-text">© 2024 EasyRent. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;

  const mailOptions = {
    from: process.env.RENTERS_SMPT_MAIL,
    to: newUser.email,
    subject: "Welcome to EasyRent - Your Journey Begins! 🏠",
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Welcome email sent successfully!");
  });
};

export default sendWelcomeEmail;
