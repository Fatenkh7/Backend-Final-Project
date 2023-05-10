import express from "express";
const router = express.Router();
import { getAll, getById, addQA, deleteQAById } from "../controllers/allQA.js";
router.get("/", getAll);
router.post("/add", addQA);
router.get("/:id", getById);
router.delete("/:id", deleteQAById);

export default router;
