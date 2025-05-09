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
const PromotionModel_1 = __importDefault(require("./PromotionModel"));
class EnrollmentModel extends PromotionModel_1.default {
    constructor() {
        super();
    }
    // 1. getSessions: List all sessions available in a promotion
    getSessions(promotionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM session WHERE id_promotion = ?`;
            return this.executeQuery(query, [promotionId]);
        });
    }
    // 2. orderSession: A student orders a session enrollment
    orderSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      INSERT INTO commande_enrollement (id_session, id_etudiant, statut, id_caissier, date_creation, transaction, payment)
      VALUES (?, ?, 'OK', 20, NOW(), ?, "MOBILE MONEY")
    `;
            return this.executeQuery(query, [data.id_session, data.id_etudiant, data.infOperation]);
        });
    }
    // 3. getSessionDetail: Retrieve detailed information about a session
    getSessionDetail(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT commande_enrollement.*, session.designation, session.montant, session.date_fin, session.date_creation, session.type
                FROM commande_enrollement
                INNER JOIN session ON session.id = commande_enrollement.id_session
                WHERE commande_enrollement.id = ?`;
            return this.executeQuery(query, [sessionId]);
        });
    }
    // 4. orderMacaron: A student orders his/her macaron for the session enrollment
    orderMacaron(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      INSERT INTO commande_macaron (id_commande, date_creation, statut, telephone, orderNumber, ref)
      VALUES (?, NOW(), 'OK', ?, ?, ?)
    `;
            const result = this.executeQuery(query, [
                data.id_commande,
                data.telephone || null,
                data.orderNumber || null,
                data.ref || null
            ]);
            return result;
        });
    }
    // 5. getSessionDetail: Retrieve detailed information about a session
    getExamens(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT examen_matiere.*, matiere.designation, matiere.credit, matiere.code, matiere.code, matiere.semestre, matiere.id_unite, unite.designation AS 'unite', unite.code
                    FROM examen_matiere 
                    INNER JOIN matiere ON matiere.id = examen_matiere.id_matiere
                    INNER JOIN unite ON unite.id = matiere.id_unite
                    WHERE examen_matiere.id_session = ?`;
            return this.executeQuery(query, [sessionId]);
        });
    }
}
exports.default = EnrollmentModel;
