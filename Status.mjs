import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: "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", // Replace with your actual API key
});

async function checkFineTuneStatus(fineTuneJobId) {
  try {
    // Retrieve the fine-tuning job details
    const response = await openai.fineTuning.jobs.retrieve(fineTuneJobId);
    console.log("Fine-tune job status:", response);
    if (response.status === "succeeded") {
      console.log("Fine-tuned model is ready to use:", response.fine_tuned_model);
    } else {
      console.log("Fine-tuning job status:", response.status);
    }
  } catch (error) {
    console.error("Error retrieving fine-tuning job status:", error.response ? error.response.data : error.message);
  }
}

// Replace with your fine-tune job ID
checkFineTuneStatus("ftjob-hDJXArPkUhBZtCLkBw0nVsf6");
