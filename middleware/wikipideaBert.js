import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import axios from "axios";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

let qnaModel;

async function initializeQnAModel() {
  // Initialize the QnA model
  qnaModel = await qna.load();
}

async function getWikipediaAnswer() {
  const question = "Who is Albert Einstein?";

  // Check if the answer is already cached
  const cachedAnswer = cache.get(question);
  if (cachedAnswer) {
    return cachedAnswer;
  }

  // Initialize the QnA model if necessary
  if (!qnaModel) {
    await initializeQnAModel();
  }

  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&titles=Albert%20Einstein`;

  try {
    const response = await axios.get(url);
    const pages = response.data.query.pages;

    // Check if no pages were returned
    if (Object.keys(pages).length === 0) {
      console.log(`No results found for '${question}'.`);
      return { answer: null, score: null };
    }

    // Check if multiple pages were returned
    if (Object.keys(pages).length > 1) {
      console.log(
        `Multiple results found for '${question}'. Returning content for the first page.`
      );
      const pageIds = Object.keys(pages);
      const firstPageId = pageIds[0];
      const answer = { answer: pages[firstPageId].extract, score: null };

      // Cache the answer for future use
      cache.set(question, answer);

      return answer;
    }

    // Otherwise, extract the page content and answer the question
    const pageId = Object.keys(pages)[0];
    const extract = pages[pageId].extract;

    // Use the QnA model to answer the question
    const answers = await qnaModel.findAnswers(question, extract);
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
