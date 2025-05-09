import { Router } from "express";
import EnrollmentController from "../controllers/EnrollmentController";

const router = Router();
const enrollmentController = new EnrollmentController();

// 1. /sessions (GET): List available sessions for a promotion (expects query param promotionId)
router.get("/:promotionId", (req, res) => enrollmentController.sessions(req, res));

// 2. /session (POST): Order a session enrollment
router.post("/session", (req, res) => enrollmentController.orderSession(req, res));

// 3. /session (GET): Retrieve detail of a session (expects query param sessionId)
router.get("/session/:cmdId", (req, res) => enrollmentController.sessionDetail(req, res));

// 4. /macaron (POST): Order a macaron for the enrolled session
router.post("/macaron", (req, res) => enrollmentController.orderMacaron(req, res));

// 5. /exmaens (GET): Download/retrieve the macaron (expects query params id_etudiant and id_session)
router.get("/examens/:id", (req, res) => enrollmentController.examenSession(req, res));

export default router;