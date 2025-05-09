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
const SectionModel_1 = __importDefault(require("../models/SectionModel"));
const Controller_1 = __importDefault(require("./Controller"));
class SectionController extends Controller_1.default {
    constructor() {
        super();
        this.sectionModel = new SectionModel_1.default();
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sigle } = req.params;
                if (!sigle) {
                    return this.badRequest(res, 'Sigle is required');
                }
                const result = yield this.sectionModel.getSectionDetail(sigle);
                return this.success(res, result.data, 'Section detail retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
    promotions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sectionId } = req.params;
                if (!sectionId) {
                    return this.badRequest(res, 'section ID is required');
                }
                const result = yield this.sectionModel.getPromotions(parseInt(sectionId, 10));
                return this.success(res, result.data, 'Promotions retrieved successfully');
            }
            catch (error) {
                return this.serverError(res, error);
            }
        });
    }
}
exports.default = SectionController;
