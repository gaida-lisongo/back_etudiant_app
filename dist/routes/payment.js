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
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = (0, express_1.Router)();
const userController = new UserController_1.default(database_1.default);
// POST /payment/save: Save payment details.
router.post("/save", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const data = yield userController.userModel.saveRechargeSolde(req.body);
    console.log("response", data);
    res.json(Object.assign({}, data));
}));
// POST /payment/success: Save payment details.
router.post("/sucess", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId } = req.body;
    const data = yield userController.userModel.deletePayment(paymentId);
    console.log("response", data);
    res.json(Object.assign({}, data));
}));
// POST /payment/response: Process payment response.
router.post("/response", (req, res) => {
    console.log(req.body);
    res.json({ message: "Payment response received" });
});
// GET /payment/verify/:id: Get all payments for a user.
router.get("/all/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const data = yield userController.userModel.getAllPayments(parseInt(id));
        console.log("response", data);
        res.json(Object.assign({}, data));
    }
    catch (error) {
        console.error("Error fetching payments: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
