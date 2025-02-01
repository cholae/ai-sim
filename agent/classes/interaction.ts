import { Action } from '../interfaces/action';
import { Agent } from './agent';
import { AI } from './ai';
import { Goal } from './goal';

export class Interaction implements Action {
  private agentA: Agent;
  private agentB: Agent;

  constructor(agentA: Agent, agentB: Agent) {
    this.agentA = agentA;
    this.agentB = agentB;
  }

  async execute(ai: AI): Promise<string> {
    try {
      this.agentA.linkAgent(this.agentB);

      const prompt = this.createInteractionPrompt(this.agentA, this.agentB);
      let response: any = await ai.generateFromPrompt(prompt);

      this.agentA.checkInteraction(this.agentB, {
        ...response[this.agentA.id],
        description: response.description
      });

      this.agentB.checkInteraction(this.agentA, {
        ...response[this.agentB.id],
        description: response.description
      });
      return response.description;
    } catch (error: any) {
      console.warn(error);
      return 'Failed to execute interaction for agent';
    }
  }

  createInteractionPrompt(agentA: Agent, agentB: Agent): string {
    //prettier-ignore
    const prompt = `
      ### Task:
        Determine if an interaction between **${agentA.name}** and **${agentB.name}** completes either agent's current milestone. 
      ### Milestone Validation Rules:
        1. **Milestone Completion Conditions**:
          - The interaction must be **directly relevant** to the milestone's **description**.
          - The milestone's **specific requirements** must be met. Simply talking is NOT enough.

        3. **Failure Logic**:
          - If the interaction is **irrelevant** to the milestone, the milestone must **not** be achieved.
          - If agents have **low relationship scores**, interactions are more likely to fail.

      Agent A:
          - Name: ${agentA.name}
          - Id: ${agentA.id}
          - Current Milestone Context: ${agentA.goal?.currentMilestone?.describe() || "none"}
          - Description: ${agentA.describe()}
          - Relationship with ${agentB.name}: You ${agentA.agentRelations[agentB.id].relation
      } them.
          - Memories of ${agentB.name}: ${agentA.agentRelations[agentB.id].describeMemories() ||
      'No significant memories yet.'
      }
      
      Agent B:
          - Name: ${agentB.name}
          - Id: ${agentB.id}
          - Current Milestone Context: ${agentA.goal?.currentMilestone?.describe() || "none"}
          - Description: ${agentB.describe()}
          - Relationship with ${agentA.name}: You ${agentB.agentRelations[agentA.id].relation
      } them.
          - Memories of ${agentA.name}: ${agentB.agentRelations[agentA.id].describeMemories() ||
      'No significant memories yet.'
      }
      
      ### Output Format:
      \`\`\`json
      {
        "description": "Summarize the interaction, reasoning for milestone completion/failure, and relationship change with the other agent.",
        "${agentA.id}": {
          "relationshipChange": <number>,
          "memoryStrength": <absolute value of relationshipChange>,
          "milestoneComplete: <number 0 or 1, where 1 means they achieved their milestone>
        },
        "${agentB.id}": {
          "relationshipChange": <number>,
          "memoryStrength": <absolute value of relationshipChange>,
          "milestoneComplete: <number 0 or 1, where 1 means they achieved their milestone>
      }
      \`\`\`
      `;
    return prompt;
  }
}
