import QuestionModel from "../models/QuestionQA.js";
import switcher from "../middleware/switchingCase.js";

export async function addQuestion(req, res, next) {
  try {
    const { question } = req.body;

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
        .json({
          answer: newAnswer,
          message: "The chat has been created successfully",
          newChat,
        });
    }

    // If no answer is found, return an error message
    return res
      .status(404)
      .json({
        message:
          "No answer found for the question. Please check another source.",
      });
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
