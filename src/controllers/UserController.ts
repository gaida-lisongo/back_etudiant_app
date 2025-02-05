import { Request, Response } from 'express';
import Controller from './Controller';
import UserModel from '../models/UserModel';
import { Pool } from 'mysql2/promise';
import { generatePassword } from '../utils/passwordGenerator';
import { sendPasswordRecoveryEmail } from '../utils/mailer';
import bcrypt from 'bcrypt';

export default class UserController extends Controller {
  private userModel: UserModel;

  constructor(db: Pool) {
    super(db);
    this.userModel = new UserModel(db);
  }

  async login(req: Request, res: Response) {
    try {
      const { matricule, password } = req.body;
      if (!matricule || !password) {
        return this.badRequest(res, 'Matricule and password are required');
      }

      const result = await this.userModel.login(matricule, password);
      if (result.status === 'error' || !Array.isArray(result.data) || !result.data[0]) {
        return this.unauthorized(res, 'Invalid credentials');
      }

      return this.success(res, result.data[0], 'Login successful');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  async checkUser(req: Request, res: Response) {
    try {
      if (!req.body) {
        return this.badRequest(res, 'Request body is missing');
      }

      const { email } = req.body;
      
      if (!email) {
        return this.badRequest(res, 'Email is required');
      }

      const result = await this.userModel.checkUser(email);
      return this.success(res, result.data, 'User check completed');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  async recovery(req: Request, res: Response) {
    try {
      const { id, matricule, nom, prenom, post_nom, e_mail } = req.body;
      
      if (!id || !e_mail) {
        return this.badRequest(res, 'All fields are required');
      }

      const newPassword = generatePassword(10);
      const result = await this.userModel.recovery({ id, password: newPassword });

      if (result.status === 'error') {
        return this.serverError(res, 'Failed to update password');
      }

      const emailSent = await sendPasswordRecoveryEmail(e_mail, nom, prenom, newPassword);
      
      if (!emailSent) {
        return this.serverError(res, 'Password updated but failed to send email');
      }

      return this.success(res, null, 'Password recovered and email sent successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  async actif(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return this.badRequest(res, 'User ID is required');
      }

      const result = await this.userModel.getStudentOrders(parseInt(userId));
            // Structure spécifique pour la réponse avec les commandes
      const responseData = {
        activated: true,
        orders: result
      };

      return this.success(res, responseData, 'User activated and orders retrieved successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  async balance(req: Request, res: Response) {
    try {
      const { userId, amount } = req.body;
      if (!userId || amount === undefined) {
        return this.badRequest(res, 'User ID and amount are required');
      }

      const result = await this.userModel.balance(userId, amount);
      return this.success(res, null, 'Balance updated successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  async photo(req: Request, res: Response) {
    try {
      const { userId, photoUrl } = req.body;
      if (!userId || !photoUrl) {
        return this.badRequest(res, 'User ID and photo URL are required');
      }

      const result = await this.userModel.photo({ userId, photoUrl });
      return this.success(res, null, 'Photo updated successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  async profile(req: Request, res: Response) {
    try {
      const { userId, nom, post_nom, prenom, sexe, date_naiss, telephone, adresse, e_mail } = req.body;
      if (!userId || !e_mail) {
        return this.badRequest(res, 'All profile fields are required');
      }

      const result = await this.userModel.profile({
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
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  async secure(req: Request, res: Response) {
    try {
      const { userId, oldPassword, newPassword } = req.body;
      if (!userId || !oldPassword || !newPassword) {
        return this.badRequest(res, 'All security fields are required');
      }

      const result = await this.userModel.secure({
        userId,
        oldPassword,
        newPassword
      });
      return this.success(res, null, 'Password changed successfully');
    } catch (error) {
      return this.serverError(res, error);
    }
  }
}