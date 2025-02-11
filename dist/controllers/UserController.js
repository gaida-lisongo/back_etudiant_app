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
const Controller_1 = __importDefault(require("./Controller"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const passwordGenerator_1 = require("../utils/passwordGenerator");
const mailer_1 = require("../utils/mailer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController extends Controller_1.default {
    constructor(db) {
        super(db);
        this.userModel = new UserModel_1.default(db);
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { matricule, password } = req.body;
                if (!matricule || !password) {
                    return this.badRequest(res, 'Matricule and password are required');
                }
                const result = yield this.userModel.login(matricule, password);
                if (result.status === 'error' || !Array.isArray(result.data) || !result.data[0]) {
                    return this.unauthorized(res, 'Invalid credentials');
                }
                const user = result.data[0];
                // Generate a JWT token (expires in 1 hour)
                const token = jsonwebtoken_1.default.sign({ id: user.id, matricule: user.matricule }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
                return this.success(res, { user, token }, 'Login successful');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    checkUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body) {
                    return this.badRequest(res, 'Request body is missing');
                }
                const { email } = req.body;
                if (!email) {
                    return this.badRequest(res, 'Email is required');
                }
                const result = yield this.userModel.checkUser(email);
                return this.success(res, result.data, 'User check completed');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    recovery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, matricule, nom, prenom, post_nom, e_mail } = req.body;
                if (!id || !e_mail) {
                    return this.badRequest(res, 'All fields are required');
                }
                const newPassword = (0, passwordGenerator_1.generatePassword)(10);
                const result = yield this.userModel.recovery({ id, password: newPassword });
                if (result.status === 'error') {
                    return this.serverError(res, 'Failed to update password');
                }
                const emailSent = yield (0, mailer_1.sendPasswordRecoveryEmail)(e_mail, nom, prenom, newPassword);
                if (!emailSent) {
                    return this.serverError(res, 'Password updated but failed to send email');
                }
                return this.success(res, null, 'Password recovered and email sent successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    actif(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    return this.badRequest(res, 'User ID is required');
                }
                const result = yield this.userModel.getStudentOrders(parseInt(userId));
                // Structure spécifique pour la réponse avec les commandes
                const responseData = {
                    activated: true,
                    orders: result
                };
                return this.success(res, responseData, 'User activated and orders retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    balance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, amount } = req.body;
                if (!userId || amount === undefined) {
                    return this.badRequest(res, 'User ID and amount are required');
                }
                const result = yield this.userModel.balance(userId, amount);
                return this.success(res, null, 'Balance updated successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    photo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, photoUrl } = req.body;
                console.log({ userId, photoUrl });
                if (!userId || !photoUrl) {
                    return this.badRequest(res, 'User ID and photo URL are required');
                }
                const result = yield this.userModel.photo({ userId, photoUrl });
                return this.success(res, null, 'Photo updated successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, nom, post_nom, prenom, sexe, date_naiss, telephone, adresse, e_mail } = req.body;
                if (!userId || !e_mail) {
                    return this.badRequest(res, 'All profile fields are required');
                }
                const result = yield this.userModel.profile({
                    userId,
                    nom,
                    post_nom,
                    prenom,
                    sexe,
                    date_naiss,
                    adresse,
                    telephone,
                    e_mail
                });
                return this.success(res, null, 'Profile updated successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    secure(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, oldPassword, newPassword } = req.body;
                if (!userId || !oldPassword || !newPassword) {
                    return this.badRequest(res, 'All security fields are required');
                }
                const result = yield this.userModel.secure({
                    userId,
                    oldPassword,
                    newPassword
                });
                return this.success(res, null, 'Password changed successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
}
exports.default = UserController;
