import User from "../models/User.js";

export async function getAll(req, res, next) {
  try {
    const users = await User.findAll();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const controller = { getAll };
export default controller;
