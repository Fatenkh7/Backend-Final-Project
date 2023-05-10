import express from "express";
const router = express.Router();
import {
  signUp,
  signIn,
  deleteUserById,
  editUserById,
  getAll,
  getById,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";
router.get("/",auth, getAll);
router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/:id",auth, getById);
router.put("/:id",auth, editUserById);
router.delete("/:id",auth, deleteUserById);

export default router;
