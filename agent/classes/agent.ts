import { faker } from '@faker-js/faker';
import { CompletedGoal, Goal } from "./goal";
import { Relationship } from './relationship';
import { Memory } from './memory';
import { RelationshipType } from '../enums/relationshipType';
import { v4 as uuid } from 'uuid';

export class Agent {
  id!: string;
  name!: string;
  description: string = "";
  sex!: "male" | "female";
  age!: number;
  trait: string | null = null;
  currentLocation!: string;
  agentRelations: Record<string, Relationship> = {};
  eventMemory: string[] = [];
  currentGoal: Goal | null = null;
  completedGoals: CompletedGoal[] = [];

  constructor({
    id = uuid(),
    name = null,
    description = "",
    sex = null,
    age = 0,
    trait = null,
    location = "",
    randomInit = false,
  }: {
    id?: string;
    name?: string | null;
    description?: string;
    sex?: "male" | "female" | null;
    age?: number;
    trait?: string | null;
    location?: string;
    randomInit?: boolean;
  } = {}) {
    if (randomInit) {
      this.randomizeAgent();
    } else {
      this.id = id;
      this.name = name!;
      this.description = description;
      this.sex = sex!;
      this.age = age;
      this.currentLocation = location;
      this.trait = trait;
    }
  }

  randomizeAgent(): void {
    this.id = uuid()
    this.sex = faker.person.sex() as "male" | "female";
    this.name = faker.person.firstName(this.sex) + " " + faker.person.lastName(this.sex);
    this.age = Math.floor(Math.random() * (45 - 18 + 1)) + 18;
    this.description = `You are ${this.name}, a ${this.age}-year-old ${this.sex}.`;
    this.trait = this.assignRandomTrait();
    this.currentGoal = Goal.assignGoalBasedOnTrait(this);
  }

  assignRandomTrait(filename: string = "traits-and-goals.json"): string {
    const traitGoals = Goal.loadTraitGoals(filename);
    const traits = Object.keys(traitGoals);
    return traits[Math.floor(Math.random() * traits.length)];
  }

  describe(): string {
    return `${this.description} Your personality traits are: [${this.trait}]. You have the current goal of ${
      this.currentGoal?.description ?? "none"
    }.`;
  }
  
  linkAgent(agent: Agent): void {
    if (!this.agentRelations[agent.id]) {
      this.agentRelations[agent.id] = new Relationship(RelationshipType.Indifferent, 0)
    }
    if(!agent.agentRelations[this.id]){
      agent.agentRelations[this.id] = new Relationship(RelationshipType.Indifferent, 0)
    }
  }

  updateRelationship(agent: Agent , interactionResponse:any): void{
    const currentRelation = this.agentRelations[agent.id];
    currentRelation.relationRating = Math.min(100, Math.max(-100, currentRelation.relationRating + interactionResponse[this.id].relationshipChange));
    currentRelation.relation = this.calculateRelation(currentRelation.relationRating) as RelationshipType;
    currentRelation.addNewMemory(interactionResponse.description,interactionResponse[this.id].memoryStrength);

    if(interactionResponse[this.id].achievedGoal == 'true' || interactionResponse[this.id].achievedGoal == true){
      this.completedGoals.push({goal: this.currentGoal?.description!, interaction: interactionResponse.description});
      this.currentGoal = Goal.assignGoalBasedOnTrait(this);
    }
  }

  determineAction(){
    return "interaction";
  }

  private calculateRelation(relationRating: number): string {
    if (relationRating <= -75) return "abhor";
    if (relationRating <= -50) return "hate";
    if (relationRating <= -25) return "dislike";
    if (relationRating <= 24) return "are indifferent to";
    if (relationRating <= 49) return "like";
    if (relationRating <= 74) return "are fond of";
    return "emotionally invested in";
  }

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
