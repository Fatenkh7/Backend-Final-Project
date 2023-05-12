import getWikipediaAnswer from "./wikipideaBert.js";
import predefqa from "../models/PredifiendQA.js";
import Chat from "../models/Chat.js";
import AllQA from "../models/AllQA.js";

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

      // Get answer from Wikipedia
      case true:
        const bestAnswer = await getWikipediaAnswer(req.body.question);
        if (bestAnswer) {
          console.log("switcch",bestAnswer.answers)
          console.log(`Answer from wiki: ${bestAnswer}`);
          return res.status(200).json({ answer: bestAnswer });
        }

        // If no answer found
        console.log(`No answer found for '${req.body.question}'`);
        return res.status(200).json({ answer: null });
    }
  } catch (err) {
    console.error(`Error while finding answer: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
}
