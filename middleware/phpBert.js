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
async function getPhpAnswer(question) {
  // Check if the answer is already cached
  const cachedAnswer = cache.get(question);
  if (cachedAnswer) {
    return cachedAnswer;
  }

  // Construct the Wikipedia API query URL
  const encodedQuestion = encodeURIComponent(question.trim());
  const apiUrl = `http://php.net/manual-lookup.php?pattern=${encodedQuestion}&scope=quickref`;

  try {
    const response = await axios.get(apiUrl);

    // Extract the description from the HTML response
    const description = extractDescription(response.data);

    // Use the QnA model to answer the question
    const answers = await qnaModel.findAnswers(question, description);
    if (answers.length === 0) {
      console.log(`No answers found for '${question}'.`);
      return { answer: null, score: null };
    }

    // Return the best answer and its score
    const answer = answers[0].answer;
    const score = answers[0].score;

    // Cache the answer for future use
    cache.set(question, { answer, score });

    return { answer, score }; // Return an object with `answer` and `score` properties
  } catch (error) {
    console.error(`Error fetching Wikipedia page: ${error}`);
    return { answer: null, score: null };
  }
}

function extractDescription(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const descriptionElement = doc.querySelector(".description");
  const description = descriptionElement
    ? descriptionElement.textContent.replace(/\n/g, "").trim()
    : "";

  return description;
}

export default getPhpAnswer;
