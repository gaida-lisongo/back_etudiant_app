import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendPasswordRecoveryEmail = async (
  email: string,
  nom: string,
  prenom: string,
  newPassword: string
): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: '"HE INBTP" <he@inbtp.net>',
      to: email,
      subject: "Récupération de mot de passe - HE INBTP",
      html: `
        <h1>Récupération de mot de passe - HE INBTP</h1>
        <p>Bonjour ${prenom} ${nom},</p>
        <p>Votre nouveau mot de passe est: <strong>${newPassword}</strong></p>
        <p>Veuillez le changer dès votre prochaine connexion.</p>
        <p>Cordialement,<br>L'équipe HE INBTP</p>
      `
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};