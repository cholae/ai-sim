import { faker } from '@faker-js/faker';
import { Goal } from "./goal";
import { Relationship } from './relationship';

export class Agent {
  name!: string;
  description: string = "";
  sex!: "male" | "female";
  age!: number;
  trait: string | null = null;
  currentLocation!: string;
  agentRelations: Record<string, Relationship> = {};
  eventMemory: string[] = [];
  currentGoal: Goal | null = null;

  constructor(
    name: string,
    description: string = "",
    sex: "male" | "female",
    age: number,
    trait: string | null = null,
    location: string,
    randomInit: boolean = false
  ) {
    if (randomInit) {
      this.randomizeAgent();
    } else {
      this.name = name;
      this.description = description;
      this.sex = sex;
      this.age = age;
      this.currentLocation = location;
      this.trait = trait;
    }
  }

  randomizeAgent(): void {
    this.sex = faker.person.sex() as "male" | "female";
    this.name = faker.person.fullName({sex: this.sex}); // Replace with a valid `names` library method
    this.age = Math.floor(Math.random() * (45 - 18 + 1)) + 18;
    this.description = `You are ${this.name}, a ${this.age}-year-old ${this.sex}.`;
    this.trait = this.assignRandomTrait();
    this.currentGoal = Goal.assignGoalBasedOnTrait(this); // Assumes Goal is a global or imported object
  }

  assignRandomTrait(filename: string = "traits-and-goals.json"): string {
    const traitGoals = Goal.loadTraitGoals(filename); // Assumes Goal is a global or imported object
    const traits = Object.keys(traitGoals);
    return traits[Math.floor(Math.random() * traits.length)];
  }

  describe(): string {
    return `${this.description} Traits: [${this.trait}] You have the current goal of ${
      this.currentGoal?.description ?? "none"
    }.`;
  }
  
  linkAgent(agent: Agent): void {
    if (!this.agentRelations[agent.name]) {
      this.agentRelations[agent.name] = new Relationship("indifferent to", 0);
      agent.linkAgent(this); // Ensure bidirectional relationship
    }
  }

  /**
   * Voting logic where the agent chooses a candidate based on relationship ratings.
   * @param candidates - List of candidates for the vote.
   * @returns The chosen agent.
   */
  vote(candidates: Agent[]): Agent {
    const weightedCandidates: { candidate: Agent; weight: number }[] = candidates.map(candidate => {
      const relationData = this.agentRelations[candidate.name];
      const weight = relationData ? relationData.relationRating : 0; // Default weight is 0
      return { candidate, weight };
    });

    const minWeight = Math.min(...weightedCandidates.map(c => c.weight));
    const normalizedCandidates = weightedCandidates.map(({ candidate, weight }) => ({
      candidate,
      weight: weight - minWeight + 1, // Ensure all weights are positive
    }));

    const totalWeight = normalizedCandidates.reduce((sum, c) => sum + c.weight, 0);

    if (totalWeight === 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }

    const randomValue = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    for (const { candidate, weight } of normalizedCandidates) {
      cumulativeWeight += weight;
      if (randomValue <= cumulativeWeight) {
        return candidate;
      }
    }

    return candidates[0];
  }
}
