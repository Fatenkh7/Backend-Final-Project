import express from "express";
const router = express.Router();
import { addQuestion, getAll } from "../controllers/question.js";
import switcher from "../middleware/switchingCase.js";
import { authenticateUser } from "../middleware/auth.js";

router.get("/", getAll);
router.post("/add", authenticateUser, switcher, addQuestion);

export default router;
