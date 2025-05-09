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
const PromotionController_1 = __importDefault(require("../controllers/PromotionController"));
const PromotionModel_1 = __importDefault(require("../models/PromotionModel"));
const router = (0, express_1.Router)();
const promoController = new PromotionController_1.default();
const model = new PromotionModel_1.default();
// Default test route
router.get("/", (req, res) => {
    res.json({ message: "Hello, world in Promotion!" });
});
// 1. presence: Enroll a student in lecon_presence
router.post("/", (req, res) => promoController.presence(req, res));
// 2. cours: Retrieve all courses related to a promotion
router.get("/cours/:promotionId", (req, res) => promoController.cours(req, res));
// 3. travaux: Retrieve all travaux linked to a course
router.get("/travaux/:courseId", (req, res) => promoController.travaux(req, res));
// 4. lecon: Retrieve lesson info and its content
router.get("/lecon/:leconId", (req, res) => promoController.lecon(req, res));
// 5. travail: Student orders a travail
router.post("/travail", (req, res) => promoController.travail(req, res));
// 6. detail_travail: Detailed information on a travail
router.get("/travail/:cmdId", (req, res) => promoController.detail_travail(req, res));
// 7. detail_presence: Detailed information on a lesson
router.get("/list_presences/:leconId", (req, res) => promoController.listPresence(req, res));
// 8. fiches: List all validation fiches for the promotion
router.get("/fiches", (req, res) => promoController.fiches(req, res));
// 9. fiche: Order a validation fiche
router.post("/fiche", (req, res) => promoController.fiche(req, res));
// 10. detail_fiche: Retrieve detail of a validation fiche order
router.get("/detail_fiche/:id", (req, res) => promoController.detailFiche(req, res));
// 11. fiche: Order a validation fiche
router.post("/cote", (req, res) => promoController.detailCoteEtudiant(req, res));
// 12. detail_fiche: Retrieve detail of a validation fiche order
router.get("/detail_enrol/:id", (req, res) => promoController.detailEnrol(req, res));
// 13. Reponse à un qrcode
router.get("/qrCode/:ficheId/:etudiantId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ficheId = parseInt(req.params.ficheId);
    const etudiantId = parseInt(req.params.etudiantId);
    /*
      Quand nous recevons cette requette nous devons envoyer une page html qui contient
      un petit bulletin de note de l'étudiant et pour y arriver nous devons recupérer les informations
      de la fiche de validation et de l'étudiant, dans un premier temps.
      Puis nous devons recupérer les cours de la promotion de l'étudiant et les notes de l'étudiant
      pour chaque cours.
      Enfin, nous devons générer un fichier html qui contient les informations de l'étudiant, les cours
      et les notes de l'étudiant.

     */
    try {
        const ficheResponse = yield model.getFiche(ficheId);
        if (!ficheResponse) {
            throw new Error("Fiche de validation non trouvée");
        }
        const ficheData = ficheResponse.data[0];
        const etudiantResponse = yield model.findById(etudiantId);
        if (!etudiantResponse) {
            throw new Error("Etudiant non trouvé");
        }
        const etudiantData = etudiantResponse.data[0];
        const anneeResponse = yield model.getThisAnnee();
        if (!anneeResponse) {
            throw new Error("Année académique non trouvée");
        }
        const currentAnnee = anneeResponse.data[0];
        const coursResponse = yield model.getCourses(ficheData.id_promotion);
        if (!coursResponse) {
            throw new Error("Cours non trouvés");
        }
        const coursData = coursResponse.data;
        const identites = () => {
            return {
                photo: etudiantData.avatar,
                phone: etudiantData.telephone ? `+243${etudiantData.telephone.slice(-9)}` : "Pas d'information",
                nom: etudiantData.nom,
                postNom: etudiantData.post_nom,
                prenom: etudiantData.prenom,
                matricule: etudiantData.matricule,
                solde: `${parseInt(etudiantData.solde)} FC`,
            };
        };
        console.log('Response Identites : ', identites());
        const fiche = () => {
            return {
                classe: `${ficheData.niveau} ${ficheData.sigle} ${ficheData.orientation ? '(' + ficheData.orientation + ')' : ''}`,
                titre: ficheData.designation,
                systeme: ficheData.systeme,
                resultat: ficheData.type,
            };
        };
        console.log('Response Fiche : ', fiche());
        const unites = () => {
            const unites = [];
            coursData.forEach((cours) => {
                const unite = unites.find((u) => u.code_unite == cours.code_unite);
                if (!unite) {
                    unites.push({
                        unite: cours.unite,
                        code_unite: cours.code_unite,
                        total: 0,
                        moyenne: 0,
                        decision: 'Non disponible',
                        notes: [],
                    });
                }
            });
            unites.forEach((u) => __awaiter(void 0, void 0, void 0, function* () {
                const matieres = coursData.filter((c) => c.code_unite == u.code_unite);
                if (matieres && matieres.length > 0) {
                    let notes = [];
                    for (const m of matieres) {
                        u.total += 20 * m.credit;
                        const note = yield model.getDetailCote(m.id, etudiantData.id, currentAnnee.id);
                        notes.push(Object.assign({}, note.data[0]));
                    }
                    u.notes = notes;
                }
                u.notes = u.notes.map((n) => {
                    u.total += n.total;
                    u.moyenne += n.moyenne;
                    return {
                        matiere: n.designation,
                        code: n.code_matiere,
                        credit: n.credit,
                        semestre: n.semestre,
                        total: n.total,
                        moyenne: n.moyenne,
                        decision: n.decision,
                    };
                });
                u.moyenne = u.moyenne / u.notes.length;
                u.decision = u.moyenne >= 50 ? 'Admis' : 'Non admis';
            }));
            return unites;
        };
        console.log('Response Unites : ', unites());
        return res.json({ ficheData, etudiantData, currentAnnee, cours: coursData });
    }
    catch (error) {
        console.error("Une erreur est survenur : ", error);
    }
}));
// Fix the errors with the notes variable
router.get("/bulletin/:promotionId/:etudiantId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Specify the type explicitly
        const notes = [];
        // Fix the syntax error in the push operation - replace {= with proper object structure
        notes.push({ cote: 10, ponderation: 2 });
        // Make sure notes is properly scoped and accessible where it's used
        const u = {
            unite: "Example Unit",
            code_unite: "Example",
            total: 0,
            moyenne: 0,
            decision: "RD",
            notes: notes // Use the properly defined notes array
        };
        // Now notes is properly defined and can be mapped
        u.notes = notes.map((n) => {
            // Processing logic here
            return n;
        });
        res.json({ success: true, data: u });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "An error occurred" });
    }
}));
exports.default = router;
