"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const section_1 = __importDefault(require("./section"));
const enrollment_1 = __importDefault(require("./enrollment"));
const promotion_1 = __importDefault(require("./promotion"));
const user_1 = __importDefault(require("./user"));
const payment_1 = __importDefault(require("./payment")); // Import the payment router
const router = (0, express_1.Router)();
// API version prefix
const API_VERSION = '/api/v1';
// Public routes: section and user endpoints are unprotected
router.use(`${API_VERSION}/section`, section_1.default);
router.use(`${API_VERSION}/user`, user_1.default);
// Protected routes: enrollement, promotion and payment endpoints require authentication
router.use(`${API_VERSION}/enrol`, authMiddleware_1.authenticate, enrollment_1.default);
router.use(`${API_VERSION}/promotion`, promotion_1.default);
router.use(`${API_VERSION}/payment`, authMiddleware_1.authenticate, payment_1.default);
exports.default = router;
