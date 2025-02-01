import { Action } from '../interfaces/action';
import { AI } from './ai';
import { Agent } from './agent';

export class IndividualAction implements Action {
  private agent: Agent;

  constructor(agent: Agent) {
    this.agent = agent;
  }
  async execute(ai: AI): Promise<string> {
    try {
      const prompt = this.createIndividualActionPrompt(this.agent);
      let response: any = await ai.generateFromPrompt(prompt);

      if (this.agent.goal && response.milestoneComplete >= 1) {
        console.log(`${this.agent.name}: milestone complete`);
        if (!this.agent.goal?.milestonesMet) {
          this.agent.goal.completedMilestones.push({
            description: this.agent.goal.currentMilestone!.description,
            interaction: response.description
          });
        }
        this.agent.goal.currentMilestone =
          this.agent.goal.remainingMilestones?.pop() ?? null;
        if (this.agent.goal.currentMilestone === null)
          this.agent.goal.milestonesMet = true;
      }
      return response.description;
    } catch (error: any) {
      return `failed to generate interaction for agent ${this.agent.name} | ${this.agent.id}`;
    }
  }

  createIndividualActionPrompt(agent: Agent): string {
    //prettier-ignore
    const prompt = `
      ### Task:
        Determine if ${
          agent.name
        } can achieve their milestone through an individual action.
      ### Milestone Validation Rules:
        1. **Milestone Completion Conditions**:
          - The interaction must be **directly relevant** to the milestone's **description**.
          - The milestone's **specific requirements** must be met in order to be completed.

      Agent A:
          - Name: ${agent.name}
          - Id: ${agent.id}
          - Milestone Context: ${
            agent.goal?.currentMilestone?.describe() || 'none'
          }
          - Description: ${agent.describe()}
      
      ### Output Format:
      \`\`\`json
      {
        "description": "Summarize the action this agent took and reasoning for milestone completion/failure.",
        "milestoneComplete: <number 0 or 1, where 1 means they achieved their milestone>
      }
      \`\`\`
      `;
    return prompt;
  }
}
