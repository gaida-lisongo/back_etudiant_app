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

//presence
router.post("/presence", async (req, res) => {
    const { etudiantId, leconId, coords } = req.body;
    console.log(req.body);
    const check = await userController.userModel.getPresence(etudiantId, leconId);
    console.log(check.data);
    if (check.data == true) {
        return res.status(200).json({ statut: "success", message: "Vous avez déjà marqué votre présence" });
    } else {
        const result = await userController.userModel.newPresence({ etudiantId, leconId, coords });
        return res.json({ ...result });
        
    }

});


router.get("/presence/:leconId/:etudiantId", async (req, res) => {
    const { etudiantId, leconId } = req.params;

    const result = await userController.userModel.getPresence(parseInt(etudiantId), parseInt(leconId));

    res.json({ ...result });
});

export default router;