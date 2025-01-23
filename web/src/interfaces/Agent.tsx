import { CompletedGoal, Goal } from "./Goal";

export interface Agent {
    id: string;
    name: string;
    description: string;
    sex: "male" | "female";
    age: number;
    trait: string;
    agentRelations: Record<string, unknown>;
    eventMemory: unknown[];
    currentGoal: Goal;
    completedGoals: CompletedGoal[];
} 