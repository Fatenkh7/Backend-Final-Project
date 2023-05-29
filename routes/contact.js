import express from "express";
const router = express.Router();
import { getAll, addMessage } from "../controllers/contact.js";

router.get("/", getAll);
router.post("/add", addMessage);

export default router;
