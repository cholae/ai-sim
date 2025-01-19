export interface Agent {
    id: string;
    name: string;
    description: string;
    sex: "male" | "female";
    age: number;
    trait: string;
    agentRelations: Record<string, unknown>;
    eventMemory: unknown[];
    currentGoal: {
      description: string;
      type: string;
    };
    completedGoals: unknown[];
}
  