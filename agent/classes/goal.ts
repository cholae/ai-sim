import { Agent } from "./agent";

export interface CompletedGoal{
  goal:string;
  interaction:string;
  completedMilestones: CompletedMilestone[];
}

export interface CompletedMilestone{
  description:string;
  interaction:string;
}

interface Milestone{
  description:string; //description of goal, e.g. make a friend
  requirements:string; //requirements to succeed, e.g. this new friend must be a leader of a group
}

export class Goal {
  description: string; //e.g. become the secretary for a powerful group
  currentMilestone: Milestone | null; //main focus
  remainingMilestones: Milestone[];
  completedMilestones: CompletedMilestone[]; //other milestones required to complete goal
  milestonesMet: boolean;
  
  constructor(description: string, milestones: Milestone[]) {
    if (!description || typeof description !== "string") {
      console.error(description);
      throw new Error("Invalid goal description.");
    }

    if (!Array.isArray(milestones) || milestones.some(m => !m.description || typeof m.description !== "string")) {
      console.error(milestones);
      throw new Error("Invalid milestones array.");
    }
    this.description = description;
    this.remainingMilestones = milestones;
    this.currentMilestone = milestones[0];
    this.completedMilestones = []; 
    this.milestonesMet = false;
  }

  describe(): string {
    return `
      Major Goal: ${this.description}
      Current Milestone: ${this.currentMilestone?.description || "none"})
    `.trim();
  }

  static createGoalBasedOnTraitPrompt(agent: Agent): string {
    return `
    ### Task:
    Generate a creative goal for ${agent.name} based on their **trait** (${agent.trait}) and the **world** (${agent.world}). Return the goal as a high-level **description** with a list of **milestones** required to achieve it.
    
    ### Requirements:
    1. The **goal description** should clearly convey a unique, high-level ambition or aspiration.
    2. Each **milestone** must:
       - Have a clear **description** of the task.
       - Include specific **requirements** needed to complete it.
    3. Order milestones logically (e.g., meet an ally, gather materials, complete a final task).
    
    ### Output Format:
    Return a **JSON object** in the following structure:
    \`\`\`json
    {
      "description": "High-level description of the goal (e.g., Build the greatest alchemy empire).",
      "milestones": [
        {
          "description": "Brief description of this milestone (e.g., Meet a skilled builder).",
          "requirements": "Specific requirements for success (e.g., Build a friendly relationship with a builder).",
        },
        ...
      ]
    }
    \`\`\`
    `
  }
}
