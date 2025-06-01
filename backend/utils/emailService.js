import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "chaitanyakhurd19@gmail.com",  // Use the email directly instead of env variable
        pass: "ornopntidohpuwes"  // Use the app password directly for testing
    }
});

export const sendOTPEmail = async (email, otp) => {
    try {
        // Verify transporter connection
        await transporter.verify();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e4d5c; text-align: center;">Email Verification</h2>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
                        <p style="font-size: 16px; color: #333;">Your verification code is:</p>
                        <h1 style="color: #2a8a7d; font-size: 32px; letter-spacing: 5px; margin: 20px 0;">${otp}</h1>
                        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
                    </div>
                    <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
                        If you didn't request this code, please ignore this email.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Propagate the error to be handled by the controller
    }
};
