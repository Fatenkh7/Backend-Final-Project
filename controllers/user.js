import User from "../models/User.js";
import bcrypt from "bcryptjs";
import salt from "salt";

const saltRounds = 11;

export async function getAll(req, res, next) {
  try {
    const users = await User.findAll();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
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
};

export async function addUser(req, res, next) {
  try {
    const { first_name, last_name, email,username, password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      first_name,
      last_name,
      email,
      username,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      password: hash
    });

    res.status(200).json({ message: "Update successful", data: updatedUser });
  } catch (err) {
    res.status(404).json({ message: err });
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
    res.status(500).json({ message: "Server error" });
  }
}

const controller = { getAll, addUser, editUserById, deleteUserById };
export default controller;
