import { Router } from "express";
import UserController from "../controllers/UserController";
import pool from "../config/database";

const router = Router();
const userController = new UserController(pool);

// Auth routes
router.post("/login", (req, res) => userController.login(req, res));
router.post("/check", (req, res) => userController.checkUser(req, res));
router.post("/recovery", (req, res) => userController.recovery(req, res));

// Account management
router.get("/activate/:userId", (req, res) => userController.actif(req, res));
router.put("/balance", (req, res) => userController.balance(req, res));
router.put("/photo", (req, res) => userController.photo(req, res));

// Profile management
router.put("/profile", (req, res) => userController.profile(req, res));
router.put("/secure", (req, res) => userController.secure(req, res));

export default router;