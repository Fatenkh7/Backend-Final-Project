import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const WORD_REPLACEMENT = [
  {
    word: "openai",
    replacement: "MashedBot",
  },
  {
    word: "MashedBot",
    replacement: "{{name}}",
  },
];

async function getChatGptResponse(pmt) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      {
        prompt: pmt,
        max_tokens: 1500,
        temperature: 1,
        top_p: 0,
        n: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    if (
      response.data.choices &&
      response.data.choices.length > 0 &&
      response.data.choices[0].text
    ) {
      let processedResponse = await postProcessingResponse(
        response.data.choices[0].text
      );
      if (processedResponse.length < 10) {
        processedResponse = "Result is:" + processedResponse;
      }
      processedResponse = processedResponse.replace("\n\n", "");
      return processedResponse;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error:", error.message);
    return "";
  }
}

async function postProcessingResponse(params) {
  WORD_REPLACEMENT.forEach((element) => {
    const regex = new RegExp(element.word, "gi");
    params = params.replace(regex, element.replacement);
  });
  return params;
}

export { getChatGptResponse };
