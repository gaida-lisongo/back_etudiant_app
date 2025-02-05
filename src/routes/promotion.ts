import { Router } from "express";
import PromotionController from "../controllers/PromotionController";
import pool from "../config/database";

const router = Router();
const promoController = new PromotionController(pool);

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

export default router;