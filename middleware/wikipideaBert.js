import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import axios from "axios";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

let qnaModel;
if (!qnaModel) {
  await initializeQnAModel();
}

async function initializeQnAModel() {
  // Initialize the QnA model
  qnaModel = await qna.load();
}

async function getWikipediaAnswer(question) {
  // Check if the answer is already cached
  const cachedAnswer = cache.get(question);
  if (cachedAnswer) {
    return cachedAnswer;
  }

  // Initialize the QnA model if necessary

  // Construct the Wikipedia API query URL
  const encodedQuestion = encodeURIComponent(question.trim());
  const url = `https://en.m.wikipedia.org/w/index.php?search=${encodedQuestion}&title=Special%3ASearch&profile=advanced&fulltext=1&ns0=1`;

  try {
    const response = await axios.get(url);
    const pages = response;
    console.log("responseee",response);
    const pageId = Object.keys(pages)[0];
    const extract = pages[pageId].extract;

    // Use the QnA model to answer the question
    const answers = await qnaModel.findAnswers(question.trim(), extract);
    console.log("answers", answers); // print out the array of answers
    if (answers.length === 0) {
      console.log(`No answers found for '${question}'.`);
      return { answer: null, score: null };
    }

    // Return the best answer and its score
    const answer = { answer: answers[0].text, score: answers[0].score };

    // Cache the answer for future use
    cache.set(question, answer);

    return answer;
  } catch (error) {
    console.log(error);
    return { answer: null, score: null };
  }
}

export default getWikipediaAnswer;
