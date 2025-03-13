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
const Model_1 = __importDefault(require("./Model"));
const crypto_1 = __importDefault(require("crypto"));
class UserModel extends Model_1.default {
    hashPassword(password) {
        return crypto_1.default.createHash('sha1').update(password).digest('hex');
    }
    constructor(db) {
        super(db);
    }
    // Méthode pour enregistrer une recharge de solde dans la table recharge_solde
    saveRechargeSolde(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      INSERT INTO recharge_solde (orderNumber, ref, phone, amount, statut, id_etudiant, currency)
      VALUES (?, ?, ?, ?, 'PENDING', ?, ?)
    `;
            return this.executeQuery(query, [
                data.orderNumber,
                data.ref,
                data.phone,
                data.amount,
                data.id_etudiant,
                data.currency
            ]);
        });
    }
    // Présence: Enregistrer un étudiant dans la table lecon_presence
    newPresence(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO lecon_presence(id_etudiant, statut, id_lecon, coords) 
                  VALUES (?, 'True', ?, ?)
    `;
            return this.executeQuery(query, [data.etudiantId, data.leconId, data.coords]);
        });
    }
    // Présence: Enregistrer un étudiant dans la table lecon_presence
    newRecours(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO commande_recours(id_etudiant, url, objet, id_matiere, content)
                  VALUES (?, ?, ?, ?, ?) 
    `;
            return this.executeQuery(query, [data.userId, data.url, data.object, data.courseId, data.content]);
        });
    }
    getRecoursByStudent(etudiantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM commande_recours WHERE id_etudiant = ? ORDER BY date_creation DESC';
            return this.executeQuery(query, [etudiantId]);
        });
    }
    getPresence(etudiantId, leconId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM lecon_presence WHERE id_etudiant = ? AND id_lecon = ?';
            return this.executeQuery(query, [etudiantId, leconId]);
        });
    }
    // Méthode pour supprimer une ligne de la table paiement selon l'id
    deletePayment(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM recharge_solde WHERE id = ?`;
            return this.executeQuery(query, [paymentId]);
        });
    }
    login(matricule, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = this.hashPassword(password);
            const query = `SELECT etudiant.id, matricule, nom, post_nom, prenom, sexe, date_naiss, adresse, telephone, e_mail, mdp, vision, avatar, amount AS 'solde', solde as 'frais', v.id_province, origin.id_ville, v.nomVille AS "ville", origin.id AS 'originId'
                  FROM etudiant
                  INNER JOIN origine_etudiant origin ON origin.id_etudiant = etudiant.id
                  INNER JOIN ville v ON v.id = origin.id_ville
                  WHERE matricule = ? AND mdp = ?`;
            return this.executeQuery(query, [matricule, hashedPassword]);
        });
    }
    checkUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM etudiant WHERE e_mail = ?';
            return this.executeQuery(query, [email]);
        });
    }
    recovery(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = this.hashPassword(data.password);
            const query = 'UPDATE etudiant SET mdp = ? WHERE id = ?';
            return this.executeQuery(query, [hashedPassword, data.id]);
        });
    }
    changeNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'UPDATE commande_recours SET statut = ? WHERE id = ?';
            return this.executeQuery(query, [data.statut, data.id]);
        });
    }
    actif(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'UPDATE etudiant SET is_active = 1 WHERE id = ?';
            return this.executeQuery(query, [userId]);
        });
    }
    balance(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'UPDATE etudiant SET amount = ? WHERE id = ?';
            return this.executeQuery(query, [amount, userId]);
        });
    }
    photo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'UPDATE etudiant SET avatar = ? WHERE id = ?';
            return this.executeQuery(query, [data.photoUrl, data.userId]);
        });
    }
    changeVilleUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'UPDATE origine_etudiant SET id_ville = ? WHERE id_etudiant = ?';
            return this.executeQuery(query, [data.villeId, data.userId]);
        });
    }
    profile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      UPDATE etudiant 
      SET nom = ?, 
          post_nom = ?, 
          prenom = ?, 
          sexe = ?, 
          date_naiss = ?, 
          adresse = ?, 
          telephone = ?, 
          e_mail = ? 
      WHERE id = ?`;
            return this.executeQuery(query, [
                data.nom,
                data.post_nom,
                data.prenom,
                data.sexe,
                data.date_naiss,
                data.adresse,
                data.telephone,
                data.e_mail,
                data.userId
            ]);
        });
    }
    secure(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedOldPassword = this.hashPassword(data.oldPassword);
            const hashedNewPassword = this.hashPassword(data.newPassword);
            const query = 'UPDATE etudiant SET mdp = ? WHERE id = ? AND mdp = ?';
            return this.executeQuery(query, [hashedNewPassword, data.userId, hashedOldPassword]);
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM etudiant WHERE id = ?';
            return this.executeQuery(query, [userId]);
        });
    }
    findByMatricule(matricule) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM etudiant WHERE matricule = ?';
            return this.executeQuery(query, [matricule]);
        });
    }
    getAllProvinces() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM province';
            return this.executeQuery(query, []);
        });
    }
    getProvinceByNom(nomProvince) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM province WHERE nomProvince LIKE ?`;
            return this.executeQuery(query, [`%${nomProvince}%`]);
        });
    }
    getProvinceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM province WHERE id = ?`;
            return this.executeQuery(query, [id]);
        });
    }
    createProvince(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO province(id_pays, nomProvince) 
                  VALUES (1, ?)
    `;
            return this.executeQuery(query, [data.province]);
        });
    }
    getAllVilles(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM ville WHERE id_province = ?';
            return this.executeQuery(query, [id]);
        });
    }
    getVilleByNom(nomVille) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM ville WHERE nomVille LIKE ?`;
            return this.executeQuery(query, [`%${nomVille}%`]);
        });
    }
    getVilleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM ville WHERE id = ?`;
            return this.executeQuery(query, [id]);
        });
    }
    createVille(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO ville(id_province, nomVille) 
                  VALUES (?, ?)
    `;
            return this.executeQuery(query, [data.province, data.ville]);
        });
    }
    getStudentOrders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queries = {
                enrol: `SELECT * FROM commande_enrollement 
              WHERE id_etudiant = ? AND statut = 'OK'`,
                macaron: `SELECT * FROM commande_macaron cm
                INNER JOIN commande_enrollement ce ON ce.id = cm.id_commande
                WHERE ce.id_etudiant = ? AND cm.statut = 'OK'`,
                travaux: `SELECT * FROM commande_travail 
                WHERE id_etudiant = ? AND statut = 'OK'`,
                validation: `SELECT * FROM commande_validation 
                  WHERE id_etudiant = ? AND statut = 'OK'`
            };
            try {
                const [enrolResult] = yield this.db.query(queries.enrol, [userId]);
                const [macaronResult] = yield this.db.query(queries.macaron, [userId]);
                const [travauxResult] = yield this.db.query(queries.travaux, [userId]);
                const [validationResult] = yield this.db.query(queries.validation, [userId]);
                return [
                    { type: 'travaux', data: travauxResult },
                    { type: 'validation', data: validationResult },
                    { type: 'enrol', data: enrolResult },
                    { type: 'macaron', data: macaronResult }
                ];
            }
            catch (error) {
                console.error('Error fetching student orders:', error);
                throw error;
            }
        });
    }
}
exports.default = UserModel;
