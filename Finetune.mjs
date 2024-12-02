import { OpenAI } from "openai";
import fs from "fs";

// Set up the OpenAI API with the API key
const openai = new OpenAI({
  apiKey: "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", // Replace with your actual API key
});

async function createFineTune() {
  try {
    // Load your training data file (in JSONL format)
    const trainingData = fs.createReadStream("romulus.jsonl"); // Replace with your dataset path

    // Upload the training data file to OpenAI
    const file = await openai.files.create({
      file: trainingData,
      purpose: "fine-tune",
    });
    console.log("File uploaded successfully. File ID:", file.id);

    // Create a fine-tune job using the uploaded file
    const fineTuneResponse = await openai.fineTuning.jobs.create({
      training_file: file.id,
      model: "gpt-3.5-turbo", // Replace with a supported model (e.g., "gpt-3.5-turbo")
      suffix: "custom-gpt", // Add a suffix for the fine-tuned model name
    });

    console.log("Fine-tune job created:", fineTuneResponse);
  } catch (error) {
    console.error("Error during fine-tuning:", error);
  }
}

createFineTune();
