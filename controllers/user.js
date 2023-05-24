import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const saltRounds = 11;

export async function getAll(req, res, next) {
  try {
    const users = await User.findAll();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error(err);
    rres.status(400).json({ error: err.message });
  }
}

export async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    res.status(200).send({ success: true, user });
  } catch (error) {
    next(error);
  }
}

export async function signUp(req, res, next) {
  try {
    const { first_name, last_name, email, username, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      first_name,
      last_name,
      email,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign({ user_id: user.id }, process.env.SECRET_TOKEN, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ user_id: user.id }, process.env.SECRET_TOKEN, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Sign in successful", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function editUserById(req, res) {
  try {
    const userId = req.params.id;
    const { first_name, last_name, email, username, password } = req.body;

    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await user.update({
      first_name,
      last_name,
      email,
      username,
      password: hash,
    });

    res.status(200).json({ message: "Update successful", data: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteUserById(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.destroy({ where: { id: userId } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

const controller = {
  getAll,
  signUp,
  signIn,
  getById,
  editUserById,
  deleteUserById,
};
export default controller;
