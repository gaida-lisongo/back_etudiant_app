"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SectionController_1 = __importDefault(require("../controllers/SectionController"));
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
const sectionController = new SectionController_1.default(database_1.default);
// GET /?sigle=... : Retrieve the detail of a section by its sigle
router.get('/:sigle', (req, res) => sectionController.detail(req, res));
// GET /promotions?sigle=... : Retrieve all promotions of a section by its sigle
router.get('/promotions/:sectionId', (req, res) => sectionController.promotions(req, res));
exports.default = router;
