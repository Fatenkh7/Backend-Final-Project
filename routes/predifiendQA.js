import express from "express";
const router = express.Router();
import {
  getAll,
  getById,
  addPreQA,
  editPreQAById,
  deletePreQAById,
} from "../controllers/predifiendQA.js";
router.get("/", getAll);
router.post("/add", addPreQA);
router.get("/:id", getById);
router.put("/:id", editPreQAById);
router.delete("/:id", deletePreQAById);

export default router;
