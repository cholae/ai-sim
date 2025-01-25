interface Milestone{
    description:string; //description of goal, e.g. make a friend
    requirements:string; //requirements to succeed, e.g. this new friend must be a leader of a group
}

interface CompletedMilestone{
    description:string;
    interaction:string;
}

export interface CompletedGoal{
    goal:string;
    interaction:string;
    completedMilestones: CompletedMilestone[];
  }

export interface Goal {
    description: string; //e.g. become the secretary for a powerful group
    currentMilestone: Milestone | null; //main focus
    remainingMilestones: Milestone[];
    completedMilestones: CompletedMilestone[]; //other milestones required to complete goal
    milestonesMet: boolean;
}