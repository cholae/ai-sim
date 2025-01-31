import { Action } from '../interfaces/action';
import { Agent } from './agent';
import { AI } from './ai';
import { Goal } from './goal';

export class GoalAction implements Action {
  private agent: Agent;

  constructor(agent: Agent) {
    this.agent = agent;
  }

  async execute(ai: AI): Promise<string> {
    const prompt = this.createFinishGoalPrompt(this.agent);
    let response: any = await ai.generateFromPrompt(prompt);

    const agentFinishedGoal = this.checkGoalCompletion(response);

    //check if we need to update goals
    try {
      if (agentFinishedGoal) {
        let goalA: any = await ai.generateFromPrompt(
          Goal.createGoalBasedOnTraitPrompt(this.agent)
        );
        this.agent.setGoal(new Goal(goalA.description, goalA.milestones));
        console.log(
          '\x1b[32m%s\x1b[0m',
          `New Goal Set for ${this.agent.name}. Goal: ${this.agent.goal?.description}.`
        );
      }
      return response.description();
    } catch (error: any) {
      const message = 'failed to add new goal';
      console.warn({ message: message, error: error });
      return message;
    }
  }

  private checkGoalCompletion(response: any): boolean {
    if (response.goalCompleted == true) {
      this.agent.completedGoals.push(
        this.agent.goal!.complete(response.description)
      );
      return true;
    }
    return false;
  }

  private createFinishGoalPrompt(agent: Agent): string {
    return `
    ### Task:
    Determine if the agent **${
      agent.name
    }** has **fully completed** their goal: "${agent.goal?.describe()}"
  
    ### Goal Completion Rules:
    1. **Description**: If the goal requires a last step, determine what it is.
    2. **World Impact Check**: If this goal leads to a **new group** or **new location**, specify its details. Otherwise, leave the array empty.
  
    ### Output Format:
    Return a **JSON object** structured as follows:
    
    \`\`\`json
      {
        "goalCompleted": true/false,
        "description": "How the agent finalized their goal",
        "worldChanges": [
          {
            "type": "group" | "location",
            "name": "The name of the group or location",
            "description": "A short description explaining its significance and use."
          }
        ]
      }
      \`\`\`
    `;
  }
}
