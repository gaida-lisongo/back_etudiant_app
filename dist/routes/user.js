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
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = (0, express_1.Router)();
const userController = new UserController_1.default();
// Auth routes
router.post("/login", (req, res) => userController.login(req, res));
router.post("/check", (req, res) => userController.checkUser(req, res));
router.post("/forgot-password", (req, res) => userController.recovery(req, res));
// Account management
router.get("/activate/:userId", (req, res) => userController.actif(req, res));
router.put("/balance", (req, res) => userController.balance(req, res));
router.put("/photo", (req, res) => userController.photo(req, res));
// Profile management
router.put("/profile", (req, res) => userController.profile(req, res));
router.put("/secure", (req, res) => userController.secure(req, res));
//presence
router.post("/presence", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { etudiantId, leconId, coords } = req.body;
    const check = yield userController.userModel.getPresence(etudiantId, leconId);
    if (check.data == true) {
        return res.status(200).json({ statut: "success", message: "Vous avez déjà marqué votre présence" });
    }
    else {
        const result = yield userController.userModel.newPresence({ etudiantId, leconId, coords });
        return res.json(Object.assign({}, result));
    }
}));
router.get("/presence/:leconId/:etudiantId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { etudiantId, leconId } = req.params;
    const result = yield userController.userModel.getPresence(parseInt(etudiantId), parseInt(leconId));
    res.json(Object.assign({}, result));
}));
// Provinces
router.get("/provinces", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resultat = yield userController.userModel.getAllProvinces();
    res.json(resultat);
}));
router.get("/searchProvince/:nom", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nom } = req.params;
    const resultat = yield userController.userModel.getProvinceByNom(nom);
    res.json(resultat);
}));
router.get("/province/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const resultat = yield userController.userModel.getVilleById(parseInt(id));
    res.json(resultat);
}));
router.post('/province', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nomProvince } = req.body;
    const result = yield userController.userModel.createProvince({ province: nomProvince });
    res.json(result);
}));
//Villes
router.get("/villes/:provinceId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { provinceId } = req.params;
    const resultat = yield userController.userModel.getAllVilles(parseInt(provinceId));
    res.json(resultat);
}));
router.get("/searchVille/:nom", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nom } = req.params;
    const resultat = yield userController.userModel.getVilleByNom(nom);
    res.json(resultat);
}));
router.get("/ville/:id_etudiant/:id_ville", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_etudiant, id_ville } = req.params;
    const resultat = yield userController.userModel.changeVilleUser({ userId: parseInt(id_etudiant), villeId: parseInt(id_ville) });
    res.json(resultat);
}));
router.post('/ville', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { provinceId, nomVille } = req.body;
    const result = yield userController.userModel.createVille({ province: provinceId, ville: nomVille });
    res.json(result);
}));
router.put('/ville', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, villeId } = req.body;
    const result = yield userController.userModel.changeVilleUser({ userId, villeId });
    res.json(result);
}));
router.post('/recours', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, object, content, url, userId } = req.body;
    console.log("Recours : ", { courseId, object, content, url, userId });
    const result = yield userController.userModel.newRecours({ userId, courseId, object, url, content });
    res.json(result);
}));
router.get('/notifications/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log("Recours : ", { userId });
    const result = yield userController.userModel.getRecoursByStudent(parseInt(userId));
    res.json(result);
}));
router.get('/notification/:id/:statut', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, statut } = req.params;
    console.log("Recours : ", { id });
    const result = yield userController.userModel.changeNotification({ id: parseInt(id), statut });
    res.json(result);
}));
exports.default = router;
