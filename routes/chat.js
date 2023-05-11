import express from "express";
const router = express.Router();
import {
  getAll,
  getById,
  addChat,
  deleteChatById,
} from "../controllers/chat.js";
import switcher from "../middleware/switchingCase.js";
router.get("/", getAll);
router.post("/add",switcher, addChat);
router.get("/:id", getById);
router.delete("/:id", deleteChatById);

export default router;
