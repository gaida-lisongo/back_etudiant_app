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
class SectionModel extends Model_1.default {
    constructor() {
        super();
    }
    // Retrieve section details by sigle
    getSectionDetail(sigle) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM section WHERE sigle = ?`;
            const result = yield this.executeQuery(query, [sigle]);
            console.log(result);
            return result;
        });
    }
    // Retrieve all promotions belonging to a section (lookup by sigle)
    getPromotions(sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT promotion.*, niveau.intitule, niveau.systeme, cycle.designation AS 'cycle'
                    FROM promotion 
                    INNER JOIN niveau ON niveau.id = promotion.id_niveau
                    INNER JOIN cycle ON cycle.id = niveau.id_cycle
                    WHERE id_section = ?`;
            const result = yield this.executeQuery(query, [sectionId]);
            return result;
        });
    }
}
exports.default = SectionModel;
