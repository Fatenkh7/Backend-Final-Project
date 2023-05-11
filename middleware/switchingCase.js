import getWikipediaAnswer from "./wikipideaBert.js";
import predefqa from "../models/PredifiendQA.js";

export default async function switcher(question, req, res, next) {
  let bestAnswer;

  // Check if the question is predefined in the PredefinedQA model
  const predefinedAnswer = await predefqa(question);
  if (predefinedAnswer) {
    console.log(`Answer from pred: ${predefinedAnswer}`);
    return predefinedAnswer;
  }

  // If the question is not predefined, check StackOverflowBERT model
  //   bestAnswer = await stackbert(question);
  //   if (bestAnswer) {
  //     console.log(`Answer: ${bestAnswer}`);
  //     return bestAnswer;
  //   }

  // If the question is not answered by StackOverflowBERT model,
  // try finding an answer in the WikipediaBERT model
  bestAnswer = await getWikipediaAnswer(question);
  if (bestAnswer) {
    console.log(`Answer from wiki: ${bestAnswer}`);
    return bestAnswer;
  }

  // If no answer is found, return null
  console.log(`No answer found for '${question}'`);
  return null;
}
