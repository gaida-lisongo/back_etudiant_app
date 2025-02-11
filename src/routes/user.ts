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
    
    const check = await userController.userModel.getPresence(etudiantId, leconId);
    
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

// Provinces
router.get("/provinces", async (req, res) => {
    const resultat = await userController.userModel.getAllProvinces()

    res.json(resultat)
});
router.get("/searchProvince/:nom", async (req, res) => {
    const { nom } = req.params
    console.log("Nom province : ", nom)

    const resultat = await userController.userModel.getProvinceByNom( nom)

    res.json(resultat)
});
router.get("/province/:id", async (req, res) => {
    const { id } = req.params
    console.log("Id province : ", id)

    const resultat = await userController.userModel.getVilleById(parseInt(id))

    res.json(resultat)

});
router.post('/province', async (req, res) => {
    const { nomProvince } = req.body;

    const result = await userController.userModel.createProvince({province: nomProvince});
    res.json(result);
})

//Villes
router.get("/villes/:provinceId", async (req, res) => {
    const { provinceId } = req.params
    console.log("Province : ", provinceId)

    const resultat = await userController.userModel.getAllVilles(parseInt(provinceId))

    res.json(resultat)
});
router.get("/searchVille/:nom", async (req, res) => {
    const { nom } = req.params
    console.log("Nom ville : ", nom)

    const resultat = await userController.userModel.getVilleByNom( nom)

    res.json(resultat)
});
router.get("/ville/:id_etudiant/:id_ville", async (req, res) => {
    const { id_etudiant, id_ville } = req.params
    console.log("Id ville : ", id_ville, " Id etudiant ", id_etudiant)

    const resultat = await userController.userModel.changeVilleUser({userId: parseInt(id_etudiant), villeId: parseInt(id_ville)})
    console.log(resultat)
    res.json(resultat)

});
router.post('/ville', async (req, res) => {
    const { provinceId, nomVille } = req.body;

    const result = await userController.userModel.createVille({ province: provinceId ,ville: nomVille});
    res.json(result);
})
router.put('/ville', async (req, res) => {
    const { userId, villeId } = req.body;

    const result = await userController.userModel.changeVilleUser({ userId, villeId });
    console.log(result)
    res.json(result);
})



export default router;