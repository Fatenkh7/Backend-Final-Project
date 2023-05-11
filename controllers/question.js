import QuestionModel from "../models/QuestionQA.js";
import switcher from "../middleware/switchingCase.js";
import Chat from "../models/Chat.js";
import PredifiendQA from "../models/PredifiendQA.js";

export async function addQuestion(req, res, next) {
  try {
    const { question } = req.body;

    // Check if the question is already in the Chat model
    const existingChat = await Chat.findOne({ where: { question } });
    let existingAnswer;

    if (existingChat) {
      console.log(`Answer found from DB chat: ${existingChat.answer}`);
      existingAnswer = existingChat.answer;
    } else {
      // If the question doesn't exist in the Chat model, check the PredifiendQA model
      const existingQA = await PredifiendQA.findOne({ where: { question } });
      if (existingQA) {
        console.log(`Answer found from DB pred: ${existingQA.answer}`);
        existingAnswer = existingQA.answer;
      }
    }

    // If there is an existing answer, return it
    if (existingAnswer) {
      const source = existingChat ? "Chat" : "PredifiendQA";
      console.log(source);
      return res.status(200).json({ answer: existingAnswer });
    }

    // If there is no existing answer, get the answer using the switcher middleware
    const newAnswer = await switcher(req, res, next);
    if (newAnswer) {
      console.log(`New answer generated: ${newAnswer}`);

      // Save the new chat to the database
      const newChat = new QuestionModel({
        question,
        answer: newAnswer,
      });

      await newChat.save();
      return res
        .status(201)
        .json({ message: "The chat has been created successfully", newChat });
    }

    // If no answer is found, return an error message
    return res
      .status(404)
      .json({ message: "No answer found for the question" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAll(req, res, next) {
  try {
    const quest = await QuestionModel.findAll();
    res.status(200).json({ success: true, data: quest });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

const controller = { getAll, addQuestion };
export default controller;
