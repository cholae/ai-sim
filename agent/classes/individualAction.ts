import { Action } from '../interfaces/action';
import { AI } from './ai';
import { Agent } from './agent';

export class IndividualAction implements Action {
  private agent: Agent;

  constructor(agent: Agent) {
    this.agent = agent;
  }
  async execute(ai: AI): Promise<string> {
    const prompt = this.createIndividualActionPrompt(this.agent);
    let response: any = await ai.generateFromPrompt(prompt);

    if (this.agent.goal && response.milestoneTotalProgress >= 1) {
      if (!this.agent.goal?.milestonesMet) {
        this.agent.goal.completedMilestones.push({
          description: this.agent.goal.currentMilestone!.description,
          interaction: response.description
        });
      }
      this.agent.goal.currentMilestone =
        this.agent.goal.remainingMilestones?.pop() || null;
      if (this.agent.goal.currentMilestone === null)
        this.agent.goal.milestonesMet = true;
    } else {
      this.agent.goal?.currentMilestone?.progressReasons.push(
        response.description
      );
    }
    return response.description;
  }

  createIndividualActionPrompt(agent: Agent): string {
    //prettier-ignore
    console.log(agent.goal)
    const prompt = `
      ### Task:
        Determine if ${
          agent.name
        } can progress their milestone through an individual action. 
      ### Milestone Validation Rules:
        1. **Milestone Completion Conditions**:
          - The interaction must be **directly relevant** to the milestone's **description**.
          - The milestone's **specific requirements** must be met.
          - A milestone should **not** be marked as complete (milestoneTotalProgress = 1) if only **partial** progress is made.

        2. **Partial Progress**:
          - If an interaction contributes toward a milestone **but does not fully meet requirements**, track progress towards the milestone by updating milestoneTotalProgress (float).

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
        "description": "Summarize the action this agent took and reasoning for milestone progress/failure.",
        "milestoneTotalProgress: <number between 0 and 1, where 1 means they achieved their milestone>
      }
      \`\`\`
      `;
    return prompt;
  }
}
