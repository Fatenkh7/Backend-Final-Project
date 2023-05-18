import express from "express";
const router = express.Router();
import {
  deleteUserById,
  editUserById,
  getAll,
  getById,
  signIn,
  signUp,
} from "../controllers/user.js";
import {authenticateUser} from "../middleware/auth.js";

router.get("/", authenticateUser, getAll);
router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/:id", authenticateUser, getById);
router.put("/:id", authenticateUser, editUserById);
router.delete("/:id", authenticateUser, deleteUserById);

export default router;
