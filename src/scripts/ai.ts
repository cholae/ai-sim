import ollama from "ollama";

export class AI {
  private model: string;

  constructor(model: string) {
    this.model = model;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await ollama.chat({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
      });

      // Extract and return the message content
      return response.message.content;
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error("Failed to generate a response from Ollama.");
    }
  }
}
