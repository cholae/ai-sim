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
                Name: ${agentA.name}
                Id: ${agentA.id}
                Description: ${agentA.description}
                Relationship with ${agentB.name}: You ${agentA.agentRelations[agentB.id].relation} them
                Memories of ${agentB.name}:
                ${agentAMemories}
    
                Name: ${agentB.name}
                Id: ${agentB.id}
                Description: ${agentB.description}
                Relationship with ${agentA.name}: You ${agentB.agentRelations[agentA.id].relation} them
                Memories of ${agentA.name}:
                ${agentBMemories}
    
                Relationship Context:
                    - A Relationship between two people ranges from -100 to 100.
                    - A value of -100 indicates the strongest possible negative relationship (e.g., this person murdered my love one, this person is a convicted arsonist).
                    - A value of 100 indicates the strongest possible positive relationship (e.g., deep friendship or love).
                    - A value of 0 indicates that these people just met, or are indifferent to each other.
                    - At 25, people become friends.
                    - At -25, people dislike each other.
                    - You are to provide a 'relationship change value' that describes how the current interaction effects the relationship of these two people.
                    - Relationship Change Value example 1: "PersonA attempted to murder PersonB" would give PersonB a -100 change in relationship to personA.
                    - Relationship Change Value example 2: "PersonA helped me find an answer to my current relationship problems" may provide 1-5 in positive change.
    
                Task:
                Summarize an interaction between ${agentA.name} and ${agentB.name}. 
                For example, this might involve a conversation, a shared activity, or a conflict. 
                Use their personality traits, memories of the person, relationship with the person, and current goals to determine what the interaction is and how it goes.
    
                Output:
                Provide the response in the following JSON format:
                {
                    "description": "A concise but detailed summary of the interaction, and your reasoning for the relationshipChange value you provided.",
                    "${agentA.id}": {
                        relationshipChange: <a number - relationship change value describing personA's change in relation with personB>,
                        memoryStrength: <a number - absolute value of personA's relationshipChangeValue>
                    },
                    "${agentB.id}": {
                        relationshipChange: <a number - relationship change value describing personB's change in relation with personA>,
                        memoryStrength: <a number - absolute value of personB's relationshipChangeValue>
                    }
                }
            `;
    }
}