import Chat from "../models/Chat.js";
import User from "../models/User.js";

export async function getAll(req, res, next) {
  try {
    const chats = await Chat.findAll({
      include: [{ model: User }],
    });
    res.status(200).json({ success: true, data: chats });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

export async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const chats = await Chat.findByPk(id, {
      include: [{ model: User }],
    });
    if (!chats) {
      return res
        .status(404)
        .send({ success: false, message: "Chat not found" });
    }
    res.status(200).send({ success: true, chats });
  } catch (error) {
    next(error);
  }
}

export async function addChat(req, res, next) {
  try {
    const { question, answer, type, user_id } = req.body;

    const newChat = new Chat({
      question,
      answer,
      type,
      user_id,
    });

    await newChat.save();

    res
      .status(201)
      .json({ message: "The chat has been created successfully", newChat });
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteChatById(req, res, next) {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({ message: "This chat  is not found" });
    }
    await Chat.destroy({ where: { id: chatId } });
    res
      .status(200)
      .json({ message: "This Chat has been deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

const controller = { getAll, getById, addChat, deleteChatById };
export default controller;
