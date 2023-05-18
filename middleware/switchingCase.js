import predefqa from "../models/PredifiendQA.js";
import Chat from "../models/Chat.js";
import getWikipediaAnswer from "./wikipideaBert.js";
import { getChatGptResponse } from "./openAi.js";

export default async function switcher(req, res, next) {
  try {
    switch (true) {
      // Check for answer in predefined QA
      case !!(await predefqa.findOne({
        where: { question: req.body.question },
      })):
        const existingPredefinedQA = await predefqa.findOne({
          where: { question: req.body.question },
        });
        console.log(
          `Answer found from predefined QA: ${existingPredefinedQA.answer}`
        );
        return res.status(200).json({ answer: existingPredefinedQA.answer });

      // Check for answer in chat
      case !!(await Chat.findOne({ where: { question: req.body.question } })):
        const existingChat = await Chat.findOne({
          where: { question: req.body.question },
        });
        console.log(`Answer found from chat: ${existingChat.answer}`);
        return res.status(200).json({ answer: existingChat.answer });

      // Get answer from OpenAI
      case true:
        const openAiAnswer = await getChatGptResponse(req.body.question);
        if (openAiAnswer) {
          console.log(`Answer from OpenAI: ${openAiAnswer}`);

          // Save the question, answer, type, and user ID in the Chat model
          const chatOpenAi = await Chat.create({
            question: req.body.question,
            answer: openAiAnswer,
            type: "chtag",
            user_id: req.user.id, // Assuming user ID is available in req.user
          });

          return res.status(200).json({ answer: openAiAnswer });
        }

      // Get answer from Wikipedia
      case true:
        const wikipediaAnswer = await getWikipediaAnswer(req.body.question);
        if (wikipediaAnswer) {
          console.log(`Answer from Wikipedia: ${wikipediaAnswer}`);

          // Save the question, answer, type, and user ID in the Chat model
          const chatWikipedia = await Chat.create({
            question: req.body.question,
            answer: wikipediaAnswer,
            type: "wikipedia",
            user_id: req.user.id, // Assuming user ID is available in req.user
          });

          return res.status(200).json({ answer: wikipediaAnswer });
        }

      // If no answer found
      default:
        console.log(`No answer found for '${req.body.question}'`);
        return res.status(200).json({ answer: null });
    }
  } catch (err) {
    console.error(`Error while finding answer: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
}
