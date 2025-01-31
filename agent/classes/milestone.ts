import { ActionType } from '../enums/actionType';

export interface CompletedMilestone {
  description: string;
  interaction: string;
}

export class Milestone {
  description: string; //description of goal, e.g. make a friend
  requirements: string; //requirements to succeed, e.g. this new friend must be a leader of a group
  type: ActionType;
  progress: number;
  progressReasons: string[];

  constructor(description: string, requirements: string, type: ActionType) {
    this.description = description;
    this.requirements = requirements;
    this.progressReasons = [];
    this.type = type;
    this.progress = 0;
  }

  describe(): string {
    const progressPercentage = (this.progress * 100).toFixed(1) + '%';
    const progressDetails =
      this.progressReasons.length > 0
        ? `\n    Progress History: ${this.progressReasons.join(', ')}`
        : '';

    return `
      Milestone: ${this.description}
      Requirements: ${this.requirements}
      Progress: ${progressPercentage}${progressDetails}
    `.trim();
  }
}
