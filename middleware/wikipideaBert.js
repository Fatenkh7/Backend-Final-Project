import axios from "axios";
import "@huggingface/inference";

export default async function getWikipediaAnswer(searchTerm, question) {
  let bertModel;
  let bertTokenizer;

  async function initializeBERT() {
    // Initialize a BERT model
    bertModel = await transformers.AutoModelForQuestionAnswering.fromPretrained(
      "bert-large-uncased-whole-word-masking-finetuned-squad"
    );

    // Initialize a tokenizer
    bertTokenizer = await transformers.AutoTokenizer.fromPretrained(
      "bert-large-uncased-whole-word-masking-finetuned-squad"
    );
  }

  async function getWikipediaAnswer(searchTerm, question) {
    // Initialize BERT if necessary
    if (!bertModel || !bertTokenizer) {
      await initializeBERT();
    }

    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${searchTerm}&exintro=1`;

    try {
      const response = await axios.get(url);
      const pages = response.data.query.pages;

      // Check if no pages were returned
      if (Object.keys(pages).length === 0) {
        console.log(`No results found for '${searchTerm}'.`);
        return { answer: null, score: null };
      }

      // Check if multiple pages were returned
      if (Object.keys(pages).length > 1) {
        console.log(
          `Multiple results found for '${searchTerm}'. Returning content for the first page.`
        );
        const pageIds = Object.keys(pages);
        const firstPageId = pageIds[0];
        return { answer: pages[firstPageId].extract, score: null };
      }

      // Otherwise, extract the page content and answer the question
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId].extract;

      // Encode the input
      const encoded = await bertTokenizer.encodePlus(question, extract, {
        truncation: true,
        padding: true,
      });

      // Run the model on the encoded input
      const input = {
        input_ids: encoded.input_ids,
        attention_mask: encoded.attention_mask,
      };
      const output = await bertModel.predict(input);

      // Extract the answer from the output
      const answerStartIndex = output.start_logits.indexOf(
        Math.max(...output.start_logits)
      );
      const answerEndIndex =
        output.end_logits.indexOf(Math.max(...output.end_logits)) + 1;
      const answer = extract.substring(
        encoded.offsets[answerStartIndex][0],
        encoded.offsets[answerEndIndex][1]
      );
      const score = Math.max(...output.start_logits);

      return { answer, score };
    } catch (error) {
      console.log(error);
      return { answer: null, score: null };
    }
  }

  async function main() {
    await initializeBERT();

    const searchTerm = prompt("Enter your search term:");
    const question = prompt("What is your question?");
    const { answer, score } = await getWikipediaAnswer(searchTerm, question);
    console.log(`Answer: ${answer}\nScore: ${score}`);
  }

  main();
}
