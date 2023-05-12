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

  // Construct the Wikipedia API query URL
  const encodedQuestion = encodeURIComponent(question.trim());
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodedQuestion}&utf8=`;
  
  try {
    const response = await axios.get(apiUrl);
    const pages = response.data.query.search;
    const page = pages[0];
    const content = page.snippet;
    console.log(content);
  
    // Use the QnA model to answer the question
    const answers = await qnaModel.findAnswers(question, content);
    console.log("response.data", content);
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
    console.error(`Error fetching Wikipedia page: ${error}`);
    return { answer: null, score: null };
  }
  
}

export default getWikipediaAnswer;
