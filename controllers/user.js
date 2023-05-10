import userModel from "../models/User.js";
import bcrypt from "bcryptjs";
/**
 * @description get all users
 * @param {object} req
 */
export async function getAll(req, res, next) {
  try {
    const response = await userModel.find({});
    return res.status(200).send({ success: true, response });
  } catch (err) {
    return next(err);
  }
}

/**
 * @description get user by id
 * @param {object} req
 */
export async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    res.status(200).send({ success: true, admin });
  } catch (error) {
    next(error);
  }
}
/**
 * @description add a new user
 * @param {object} req
 */
export async function addUser(req, res, next) {
  try {
    const { firstName, lastName, email, password, phone } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
/**
 * @description update user by id
 * @param {object} req
 */
export async function editUserById(req, res) {
  try {
    let filter = { _id: req.params.id };
    let update = req.body;

    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(req.body.password, salt);
    update.password = hash;
    const updateUser = await userModel.findOneAndUpdate(filter, update, {
      //for save it in the database
      new: true,
    });
    res.status(200).json({ message: "Update successfully", data: updateUser });
  } catch (err) {
    res.status(404).json({ message: err });
  }
}
/**
 * @description delete user by id
 * @param {object} req
 */
export async function deleteUserById(req, res, next) {
  try {
    const removeUser = await userModel.findOneAndDelete({
      _id: req.params.id,
    });
    res
      .status(200)
      .json({ data: removeUser, message: "This user has been deleted" });
  } catch (err) {
    res.status(404).json({ message: err });
  }
}

const controller = { addUser, getAll, deleteUserById, getById, editUserById };
export default controller;
