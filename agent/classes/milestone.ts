import { ActionType } from '../enums/actionType';

export interface CompletedMilestone {
  description: string;
  interaction: string;
}

export class Milestone {
  description: string; //description of goal, e.g. make a friend
  requirements: string; //requirements to succeed, e.g. this new friend must be a leader of a group
  type: ActionType;

  constructor(description: string, requirements: string, type: ActionType) {
    this.description = description;
    this.requirements = requirements;
    this.type = type;
  }

  describe(): string {
    return `
      Milestone: ${this.description}
      Requirements: ${this.requirements}
    `.trim();
  }
}
