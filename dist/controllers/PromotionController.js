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
const PromotionModel_1 = __importDefault(require("../models/PromotionModel"));
const UserController_1 = __importDefault(require("./UserController"));
class PromotionController extends UserController_1.default {
    constructor(db) {
        super(db);
        this.promotionModel = new PromotionModel_1.default(db);
    }
    // 1. presence: Enroll a student in lecon_presence table
    presence(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_etudiant, date_inscription, statut, id_lecon, coords } = req.body;
                if (!id_etudiant || !date_inscription || !statut || !id_lecon) {
                    return this.badRequest(res, 'Missing required fields');
                }
                const result = yield this.promotionModel.presence({ id_etudiant, date_inscription, statut, id_lecon, coords });
                return this.success(res, result.data, 'Presence recorded successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // 2. cours: Retrieve all courses related to a promotion
    cours(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { promotionId } = req.params;
                if (!promotionId) {
                    return this.badRequest(res, 'Promotion ID is required');
                }
                const result = yield this.promotionModel.getCourses(parseInt(promotionId, 10));
                return this.success(res, result.data, 'Courses retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // 3. travaux: Retrieve all travaux linked to a course
    travaux(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                if (!courseId) {
                    return this.badRequest(res, 'Course ID is required');
                }
                const result = yield this.promotionModel.getTravaux(parseInt(courseId, 10));
                return this.success(res, result.data, 'Travaux retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // 4. lecon: Retrieve lesson info and its content (e.g., PDF, Excel, images)
    lecon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { leconId } = req.params;
                if (!leconId) {
                    return this.badRequest(res, 'Lecon ID is required');
                }
                const result = yield this.promotionModel.getLecon(parseInt(leconId, 10));
                return this.success(res, result.data, 'Lecon retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // 5. travail: Allow a student to order a travail (commande_travail)
    travail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_etudiant, id_travail, id_annee, additionalInfo } = req.body;
                if (!id_etudiant || !id_travail || !id_annee) {
                    return this.badRequest(res, 'Missing required fields');
                }
                const result = yield this.promotionModel.orderTravail({ id_etudiant, id_travail, id_annee, additionalInfo });
                return this.success(res, result.data, 'Travail ordered successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // 6. detail_travail: Retrieve detailed information about a travail
    detail_travail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cmdId } = req.params;
                if (!cmdId) {
                    return this.badRequest(res, 'Travail ID is required');
                }
                const result = yield this.promotionModel.getDetailTravail(parseInt(cmdId, 10));
                return this.success(res, result.data, 'Detail travail retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // New method: listPresence - lists all students present in a lesson
    listPresence(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { leconId } = req.params;
                if (!leconId) {
                    return this.badRequest(res, 'Lecon ID is required');
                }
                const result = yield this.promotionModel.listePresence(parseInt(leconId, 10));
                return this.success(res, result.data, 'List of presences retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // New method: fiches – Liste toutes les fiches de validation
    fiches(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.promotionModel.getFiches();
                return this.success(res, result.data, 'Fiches retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // New method: fiche – Commander une fiche de validation
    fiche(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_validation, id_etudiant, additionalInfo } = req.body;
                if (!id_validation || !id_etudiant) {
                    return this.badRequest(res, 'id_validation and id_etudiant are required');
                }
                const result = yield this.promotionModel.orderFiche({ id_validation, id_etudiant, additionalInfo });
                return this.success(res, result.data, 'Fiche ordered successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // New method: detailFiche – Récupérer le détail d'une commande de fiche
    detailFiche(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return this.badRequest(res, 'Fiche ID is required');
                }
                const result = yield this.promotionModel.getDetailFiche(parseInt(id, 10));
                return this.success(res, result.data, 'Fiche detail retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // New method: detailFiche – Récupérer le détail d'une commande de fiche
    detailEnrol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return this.badRequest(res, 'Fiche ID is required');
                }
                const result = yield this.promotionModel.getDetailEnrol(parseInt(id, 10));
                return this.success(res, result.data, 'Fiche detail retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // New method: detailCoteStudiant - Récupérer le détail d'une cote d'un étudiant
    detailCoteEtudiant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_matiere, id_etudiant } = req.body;
                const annee = yield this.promotionModel.getThisAnnee();
                const id_annee = annee.data[0].id;
                if (!id_matiere || !id_etudiant || !id_annee) {
                    return this.badRequest(res, 'id_matiere, id_etudiant and id_annee are required');
                }
                const result = yield this.promotionModel.getDetailCote(id_matiere, id_etudiant, id_annee);
                return this.success(res, result.data, 'Cote detail retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
}
exports.default = PromotionController;
