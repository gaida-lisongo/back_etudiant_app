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
const EnrollmentModel_1 = __importDefault(require("../models/EnrollmentModel"));
const PromotionController_1 = __importDefault(require("./PromotionController"));
class EnrollmentController extends PromotionController_1.default {
    constructor() {
        super();
        this.enrollmentModel = new EnrollmentModel_1.default();
    }
    // 1. /sessions (GET): List available sessions for a promotion.
    sessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { promotionId } = req.params;
                if (!promotionId) {
                    return this.badRequest(res, 'Promotion ID is required');
                }
                const result = yield this.enrollmentModel.getSessions(parseInt(promotionId, 10));
                return this.success(res, result.data, 'Sessions retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // 2. /session (POST): Order a session enrollment.
    orderSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_session, id_etudiant, infOperation } = req.body;
                if (!id_session || !id_etudiant) {
                    return this.badRequest(res, 'id_session and id_etudiant are required');
                }
                const result = yield this.enrollmentModel.orderSession({ id_session, id_etudiant, infOperation });
                return this.success(res, result.data, 'Session enrollment ordered successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // 3. /session (GET): Retrieve detail of a session.
    sessionDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cmdId } = req.params;
                if (!cmdId) {
                    return this.badRequest(res, 'sessionId is required');
                }
                const result = yield this.enrollmentModel.getSessionDetail(parseInt(cmdId, 10));
                return this.success(res, result.data, 'Session detail retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // 4. /macaron (POST): Order a macaron for a session enrollment.
    orderMacaron(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_commande, telephone, orderNumber, ref } = req.body;
                if (!telephone || !id_commande || !orderNumber) {
                    return this.badRequest(res, 'id_etudiant and id_commande are required');
                }
                const result = yield this.enrollmentModel.orderMacaron({ id_commande, telephone, orderNumber, ref });
                console.log("Achat macaron response  : ", result);
                return this.success(res, result.data, 'Macaron ordered successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    // 5. /session (GET): Retrieve detail of a session.
    examenSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return this.badRequest(res, 'sessionId is required');
                }
                const result = yield this.enrollmentModel.getExamens(parseInt(id, 10));
                return this.success(res, result.data, 'Session detail retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
}
exports.default = EnrollmentController;
