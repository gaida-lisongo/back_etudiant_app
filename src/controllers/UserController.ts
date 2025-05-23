import { Request, Response } from 'express';
import Controller from './Controller';
import UserModel from '../models/UserModel';
import { Pool } from 'mysql2/promise';
import { generatePassword } from '../utils/passwordGenerator';
import { sendPasswordRecoveryEmail } from '../utils/mailer';
import jwt from 'jsonwebtoken';

export default class UserController extends Controller {
  userModel: UserModel;

  constructor() {
    super();
    this.userModel = new UserModel();
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
      
      const user = result.data[0];
      // Generate a JWT token (expires in 1 hour)
      const token = jwt.sign(
        { id: user.id, matricule: user.matricule },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '1h' }
      );

      return this.success(res, { user, token }, 'Login successful');
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
    console.log('Current user ', req.body);
    try {
      const {  email } = req.body;
      console.log({ email })
      
      if (!email) {
        return this.badRequest(res, 'Vous devez fournir votre adresse e-mail');  
      }

      // Vérifier si l'email est référencé dans la base de données
      const userResult = await this.userModel.checkUser(email) as { data: { id: number; nom: string; prenom: string; matricule: string; }[] };
      console.log("Current user ", { userResult });

      if (!userResult.data || userResult.data.length === 0) {
        return this.badRequest(res, "L'email n'est pas référencé");
      }

      const user = userResult.data[0];
      const newPassword = generatePassword(10);
      const result = await this.userModel.recovery({ id : user.id, password: newPassword });

      if (result.status === 'error') {
        return this.serverError(res, 'Un problème est survenu lors de la mise à jour du mot de passe');
      }

      const emailSent = await sendPasswordRecoveryEmail(email, user.nom, user.prenom, user.matricule, newPassword);
      console.log("Resultat de l'envoi de l'email : ", emailSent);
      if (!emailSent) {
        return this.serverError(res, 'Mot de passe mise à jour mais l\'email n\'a pas pu être envoyé');
      }

      return this.success(res, null, 'Prière de consultez votre boîte mail pour votre nouveau mot de passe');
    } catch (error) {
      return this.serverError(res, error);
    }
  }

  async actif(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      console.log({ userId })
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
      console.log("Request Profile info , ", { userId, nom, post_nom, prenom, sexe, date_naiss, telephone, adresse, e_mail })
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