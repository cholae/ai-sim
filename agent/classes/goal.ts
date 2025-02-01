import { Agent } from './agent';
import { Milestone, CompletedMilestone } from './milestone';
import { Settlement } from './settlement';

export interface CompletedGoal {
  goal: string;
  interaction: string;
  completedMilestones: CompletedMilestone[];
}

export class Goal {
  description: string; //e.g. become the secretary for a powerful group
  currentMilestone: Milestone | null; //main focus
  remainingMilestones: Milestone[];
  completedMilestones: CompletedMilestone[]; //other milestones required to complete goal
  milestonesMet: boolean;

  constructor(description: string, milestones: Milestone[]) {
    if (!description || typeof description !== 'string') {
      console.error(description);
      throw new Error('Invalid goal description.');
    }

    if (
      !Array.isArray(milestones) ||
      milestones.some(
        (m) => !m.description || typeof m.description !== 'string'
      )
    ) {
      console.error(milestones);
      throw new Error('Invalid milestones array.');
    }
    this.description = description;
    this.remainingMilestones = milestones;
    this.currentMilestone = milestones[0];
    this.completedMilestones = [];
    this.milestonesMet = false;
  }

  describe(): string {
    const completedMilestoneDescriptions =
      this.completedMilestones.length > 0
        ? this.completedMilestones.map((m) => m.description).join(', ')
        : 'none';

    return `
      Goal: ${this.description}
      Completed Milestones: ${completedMilestoneDescriptions})
    `.trim();
  }

  complete(interaction: string): CompletedGoal {
    return {
      goal: this.description,
      interaction: interaction,
      completedMilestones: this.completedMilestones
    };
  }

  static createGoalBasedOnTraitPrompt(
    agent: Agent,
    location: Settlement
  ): string {
    return `
    ### Task:
    Generate a creative goal for ${agent.name} based on their **trait** (${
      agent.trait
    }) and the **world** (${
      agent.world
    }). Return the goal as a high-level **description** with a list of **milestones** required to achieve it.
    
    ### Requirements:
    1. The **goal description** should clearly convey a unique, high-level ambition or aspiration.
    2. Each **milestone** must:
       - Have a clear **description** of the task.
       - Include specific **requirements** needed to complete it, which are binary in their resolution.
       - include a actionType - does this milestone require interaction with other agents, or individual actions? (e.g. explore a cave vs. befriend an engineer)
    3. Order milestones logically (e.g., meet a person with a certain skill set, gather materials, use both the person and materials to finish a task).
    4. Limit required relationships by "Job" from the list below. For example, do not require a specific person with a job by name, and simply require the job itself.
    **Job List**:
    ${location.describeJobs()}
    
    ### Output Format:
    Return a **JSON object** in the following structure:
    \`\`\`json
    {
      "description": "High-level description of the goal (e.g., Build the greatest alchemy empire).",
      "milestones": [
        {
          "description": "Brief description of this milestone (e.g., Meet a skilled builder).",
          "requirements": "Specific requirements for success (e.g., Build a friendly relationship with a builder).",
          "type:" "interaction" ||(or) "individualAction"
        },
        ...
      ]
    }
    \`\`\`
    `;
  }
}
