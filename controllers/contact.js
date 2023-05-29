import ContactModel from "../models/Contact.js";

export async function addMessage(req, res, next) {
  try {
    const { first_name, last_name, email, message } = req.body;

    const newMessage = await ContactModel.create({
      first_name,
      last_name,
      email,
      message,
    });

    await newMessage.save();

    res
      .status(201)
      .json({ message: "Thank you for contacting us", newMessage });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAll(req, res, next) {
  try {
    const messages = await ContactModel.findAll();
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

const controller = { getAll, addMessage };
export default controller;
