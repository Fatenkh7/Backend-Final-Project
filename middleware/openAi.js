import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import axios from "axios";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

// let qnaModel;
// if (!qnaModel) {
//   await initializeQnAModel();
// }

// async function initializeQnAModel() {
//   // Initialize the QnA model
//   qnaModel = await qna.load();
// }

async function getOpenAiAnswer(question) {
  // Check if the answer is already cached
  const cachedAnswer = cache.get(question);
  if (cachedAnswer) {
    return cachedAnswer;
  }

  // Construct the Wikipedia API query URL
  const encodedQuestion = encodeURIComponent(question.trim());
  const apiUrl = `https://api.openai.com/v1/engines/text-davinci-003/completions/${encodedQuestion}`;

  try {
    const response = await axios.get(apiUrl);
    console.log(response)
    // Extract the answer from the response
    const answer = response.data.choices[0].text.trim();
    // const pages = response.data.query.search;
    // const page = pages[0];
    // console.log("pages0", page);
    // const content = page.snippet.replace(/<[^>]+>/g, "");
    // console.log("content", content);

    // Cache the answer for future use
    cache.set(question, answer);
    console.log(answer);
    return answer;
  } catch (error) {
    console.error(`Error fetching ai page: ${error}`);
    return null;
  }
}

export default getOpenAiAnswer;
