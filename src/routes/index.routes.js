import { Router } from "express";
const router = Router();
import { signUser , restrictedPage } from "../controllers/users.controllers.js";

/* Rutas */
router.get("/", async (req, res) => {
  try {
    res.sendFile("/index.html");
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

router.use("/SignIn", signUser);
router.get("/dashboard", restrictedPage);

export default router;
