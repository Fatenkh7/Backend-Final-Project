import express from "express";
const router = express.Router();
import { addQuestion, getAll } from "../controllers/question.js";
import switcher from "../middleware/switchingCase.js";

router.get("/", getAll);
router.post("/add", switcher, addQuestion);

export default router;
