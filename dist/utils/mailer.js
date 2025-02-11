"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordRecoveryEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
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
const sendPasswordRecoveryEmail = (email, nom, prenom, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
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
    }
    catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
});
exports.sendPasswordRecoveryEmail = sendPasswordRecoveryEmail;
