import * as fs from "fs";
import * as path from "path";
import { Agent } from "./agent";


export interface CompletedGoal{
  goal:string;
  interaction:string;
}

interface TraitGoals {
  [trait: string]: {
    goals: Goal[];
  };
}

export class Goal {
  description: string;
  type: string;

  constructor(description: string, goalType: string) {
    this.description = description;
    this.type = goalType;
  }

  describe(): string {
    return `Current ${this.type} goal: ${this.description}`;
  }

  static loadTraitGoals(filename: string): TraitGoals {
    try {
      const filePath = path.resolve(filename);
      const fileContent = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileContent) as TraitGoals;
    } catch (error:any) {
      if (error.code === "ENOENT") {
        throw new Error(`File '${filename}' not found. Ensure the file exists and the path is correct.`);
      } else if (error instanceof SyntaxError) {
        throw new Error(`File '${filename}' contains invalid JSON. Please check the file format.`);
      } else {
        throw error;
      }
    }
  }

  static assignGoalBasedOnTrait(agent: Agent, filename: string = "traits-and-goals.json"): Goal | null {
    if(agent.trait){
        try {
        const traitGoals = Goal.loadTraitGoals(filename);
        const possibleGoals = traitGoals[agent.trait].goals;

        if (possibleGoals && possibleGoals.length > 0) {
            // Randomly select a goal related to this trait
            const selectedGoalData = possibleGoals[Math.floor(Math.random() * possibleGoals.length)];
            return new Goal(selectedGoalData.description, selectedGoalData.type);
        }
        } catch (error) {
        console.error(`Error assigning goal based on trait: ${error}`);
        }
    }

    return null; // Return null if no matching goal is found
  }
}
