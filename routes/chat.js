import express from "express";
const router = express.Router();
import {
  getAll,
  getById,
  addChat,
  deleteChatById,
} from "../controllers/chat.js";
router.get("/", getAll);
router.post("/add", addChat);
router.get("/:id", getById);
router.delete("/:id", deleteChatById);

export default router;
