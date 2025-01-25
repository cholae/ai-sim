import ollama from "ollama";

export class AI {
  private model: string;

  constructor(model: string) {
    this.model = model;
  }

  async generateFromPrompt(prompt: string): Promise<string> {
    try {
      const response = await ollama.generate({
        model: this.model,
        prompt: prompt,
        format: "json",
        raw: true,
        stream: false
      });

      // Extract and return the message content
      return JSON.parse(response.response);
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error("Failed to generate a response from Ollama.");
    }
  }
}
