import { Action } from "../interfaces/action";
import { Agent } from "./agent";
import { AI } from "../scripts/ai";

export class Interaction implements Action{
    private agentA: Agent;
    private agentB: Agent;
  
    constructor(agentA: Agent, agentB: Agent) {
      this.agentA = agentA;
      this.agentB = agentB;
    }

    async execute(ai:AI): Promise<void> {
        this.agentA.linkAgent(this.agentB);

        const prompt = this.createInteractionPrompt(this.agentA, this.agentB)
        let response:any = await ai.generateInteraction(prompt);
        console.log(response);
    
        // Apply relationship change
        this.agentA.updateRelationship(this.agentB, response);
        this.agentB.updateRelationship(this.agentA, response);
    }

    createInteractionPrompt(agentA: Agent, agentB: Agent): string {
        const agentAMemories = agentA.agentRelations[agentB.id].interactionMemory
            .sort((a, b) => b.strength - a.strength) // Sort memories strongest to weakest
            .map(memory => `- ${memory.description}`)
            .join("\n");
    
        const agentBMemories = agentB.agentRelations[agentA.id].interactionMemory
            .sort((a, b) => b.strength - a.strength)
            .map(memory => `- ${memory.description}`)
            .join("\n");
    
        return `
        Agent A:
        - Name: ${agentA.name}
        - Id: ${agentA.id}
        - Description: ${agentA.describe()}
        - Relationship with ${agentB.name}: You ${agentA.agentRelations[agentB.id].relation} them.
        - Memories of ${agentB.name}: ${agentAMemories}
        
        Agent B:
        - Name: ${agentB.name}
        - Id: ${agentB.id}
        - Description: ${agentB.describe()}
        - Relationship with ${agentA.name}: You ${agentB.agentRelations[agentA.id].relation} them.
        - Memories of ${agentA.name}: ${agentBMemories}
        
        ### Context:
        - The relationship score between two agents ranges from -100 to +100. A +100 indicates strong love or friendship, while -100 indicates extreme hatred. These changes should occur gradually and not be extreme in one interaction.
        - Use each agent's personality traits, memories, and goals to simulate the interaction and determine outcomes.
        - For each interaction, calculate:
          1. **Relationship Change Value:** How the interaction affects the relationship score.
          2. **Memory Strength:** Use the absolute value of the Relationship Change Value.
          3. **Achieved Goal:** Indicate if the agent achieved their current goal.
        
        ### Task:
        Describe an interaction between ${agentA.name} and ${agentB.name} (e.g., conversation, activity, or conflict). Use their traits and context to decide the outcome.
        
        ### Output Format:
        \`\`\`json
        {
          "description": "Summarize the interaction, reasoning for goal achievement, and relationship change.",
          "${agentA.id}": {
            "relationshipChange": <number>,
            "memoryStrength": <absolute value of relationshipChange>,
            "achievedGoal": true/false
          },
          "${agentB.id}": {
            "relationshipChange": <number>,
            "memoryStrength": <absolute value of relationshipChange>,
            "achievedGoal": true/false
          }
        }
        
            `;
    }
}