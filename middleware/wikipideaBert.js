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
  const url = `https://en.m.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&prop=pageimages%7Cdescription&piprop=thumbnail&pithumbsize=160&pilimit=3&generator=search&gsrsearch=${encodedQuestion}&gsrnamespace=0&gsrlimit=3&gsrqiprofile=classic_noboostlinks&uselang=content&smaxage=86400&maxage=86400`;

  try {
    const response = await axios.get(url);
    const pageId = response.data.query.pages[0];
    // const extract = response.data.query.pages[0].pageId;

    // Use the QnA model to answer the question
    const answers = await qnaModel.findAnswers(question.trim(), pageId);
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
