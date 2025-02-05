import e, { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello, world in Promotion!" });
});

export default router;