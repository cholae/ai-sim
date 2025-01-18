import { AI } from "./scripts/ai";

async function main() {
    const ai = new AI("mistral");
    const response = await ai.generateResponse("What is the capital of France?");
    console.log("AI Response:", response);
}

main();