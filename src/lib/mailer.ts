import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (to: string, token: string) => {

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER, // e.g., "no-reply@example.com"
    to,
    subject: "Verify Your Email",
    html: `<p>Please verify your email by clicking the link below:</p>
           <p><a href="${verificationUrl}">Verify Email</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};
