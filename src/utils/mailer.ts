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
  matricule: string,
  newPassword: string
): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: '"HE INBTP" <he@inbtp.net>',
      to: email,
      subject: "Récupération de mot de passe - HE INBTP",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <div style="background-color: #007BFF; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">HE INBTP</h1>
              </div>
              <!-- Body -->
              <div style="padding: 20px;">
                <p style="font-size: 16px; color: #333;">Bonjour ${prenom} ${nom} (Matricule: ${matricule}),</p>
                <p style="font-size: 16px; color: #333;">Votre nouveau mot de passe est : <strong>${newPassword}</strong></p>
                <p style="font-size: 16px; color: #333;">Veuillez le changer dès votre prochaine connexion pour des raisons de sécurité.</p>
              </div>
              <!-- Footer -->
              <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
                <p style="color: #777; font-size: 14px; margin: 0;">Cordialement,</p>
                <p style="color: #777; font-size: 14px; margin: 0;">L'équipe HE INBTP</p>
              </div>
            </div>
          </body>
        </html>
      `
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};