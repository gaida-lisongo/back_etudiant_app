import { Router } from "express";
import pool from "../config/database";
import UserController from "../controllers/UserController";

const router = Router();
const userController = new UserController(pool);

// POST /payment/save: Save payment details.
router.post("/save", async (req, res) => {
    console.log(req.body);
    const data = await userController.userModel.saveRechargeSolde(req.body)
    console.log("response",data)
    res.json({ ...data});
});

// POST /payment/success: Save payment details.
router.post("/sucess", async (req, res) => {
    const { paymentId } = req.body;
    const data = await userController.userModel.deletePayment(paymentId)
    console.log("response",data)
    res.json({ ...data});
});

// POST /payment/response: Process payment response.
router.post("/response", (req, res) => {
    console.log(req.body);
    res.json({ message: "Payment response received" });
});

// GET /payment/verify/:id: Get all payments for a user.
router.get("/all/:id", async (req, res) => {
    console.log(req.params);
    
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const data = await userController.userModel.getAllPayments(parseInt(id))
        console.log("response",data)
        res.json({ ...data});
    } catch (error) {
        console.error("Error fetching payments: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


export default router;