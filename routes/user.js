import express from 'express';
const router = express.Router();
import { addUser, deleteUserById, editUserById, getAll, getById } from '../controllers/user.js';
router.get("/", getAll);
router.post("/add", addUser);
router.get("/:id", getById);
router.put("/:id", editUserById);
router.delete("/:id", deleteUserById);

export default router;
