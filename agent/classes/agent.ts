import { faker } from '@faker-js/faker';
import { CompletedGoal, Goal } from './goal';
import { Relationship } from './relationship';
import { RelationshipType } from '../enums/relationshipType';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { InteractionResponse } from '../interfaces/interactionResponse';
import { Settlement } from './settlement';
import { ActionType } from '../enums/actionType';

export class Agent {
  id!: string;
  name!: string;
  description: string = '';
  sex!: 'male' | 'female';
  age!: number;
  trait: string | null = null;
  currentLocation!: string;
  agentRelations: Record<string, Relationship> = {};
  eventMemory: string[] = [];
  goal: Goal | null = null;
  completedGoals: CompletedGoal[] = [];
  home: Settlement | null;
  job!: string;
  world: string = '';

  constructor({
    id = uuid(),
    name = null,
    description = '',
    sex = null,
    age = 0,
    trait = null,
    location = '',
    randomInit = false,
    goal = null,
    home = null,
    job = ''
  }: {
    id?: string;
    name?: string | null;
    description?: string;
    sex?: 'male' | 'female' | null;
    age?: number;
    trait?: string | null;
    location?: string;
    randomInit?: boolean;
    goal?: Goal | null;
    home?: Settlement | null;
    job?: string;
  } = {}) {
    if (randomInit) {
      this.home = null;
      this.randomizeAgent('You live in a high fantasy world.');
    } else {
      this.id = id;
      this.name = name!;
      this.description = description;
      this.sex = sex!;
      this.age = age;
      this.currentLocation = location;
      this.trait = trait;
      this.goal = goal;
      this.home = null;
      this.job = job;
    }
  }

  randomizeAgent(world: string): void {
    this.id = uuid();
    this.sex = faker.person.sex() as 'male' | 'female';
    this.name =
      faker.person.firstName(this.sex) + ' ' + faker.person.lastName(this.sex);
    this.age = Math.floor(Math.random() * (45 - 18 + 1)) + 18;
    this.description = `${this.name}, a ${this.age}-year-old ${this.sex}.`;
    this.trait = this.assignRandomTrait();
    this.job = this.assignRandomJob();
    this.world = world;
  }

  assignRandomTrait(filename: string = 'traits.json'): string {
    try {
      const filePath = path.resolve(filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const traits = JSON.parse(fileContent) as string[];
      return traits[Math.floor(Math.random() * traits.length)];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new Error(
          `File '${filename}' not found. Ensure the file exists and the path is correct.`
        );
      } else if (error instanceof SyntaxError) {
        throw new Error(
          `File '${filename}' contains invalid JSON. Please check the file format.`
        );
      } else {
        throw error;
      }
    }
  }

  assignRandomJob(filename: string = 'jobs.json'): string {
    try {
      const filePath = path.resolve(filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const traits = JSON.parse(fileContent) as string[];
      return traits[Math.floor(Math.random() * traits.length)];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new Error(
          `File '${filename}' not found. Ensure the file exists and the path is correct.`
        );
      } else if (error instanceof SyntaxError) {
        throw new Error(
          `File '${filename}' contains invalid JSON. Please check the file format.`
        );
      } else {
        throw error;
      }
    }
  }

  describe(): string {
    return `${this.description} Your personality traits are: [${this.trait}]. Your current job is: **${this.job}**`;
  }

  linkAgent(agent: Agent): void {
    if (!this.agentRelations[agent.id]) {
      this.agentRelations[agent.id] = new Relationship(
        RelationshipType.Indifferent,
        0
      );
    }
    if (!agent.agentRelations[this.id]) {
      agent.agentRelations[this.id] = new Relationship(
        RelationshipType.Indifferent,
        0
      );
    }
  }

  checkInteraction(
    agent: Agent,
    interactionResponse: InteractionResponse
  ): void {
    try {
      const currentRelation = this.agentRelations[agent.id];
      currentRelation.relationRating = Math.min(
        100,
        Math.max(
          -100,
          currentRelation.relationRating +
            interactionResponse.relationshipChange
        )
      );
      currentRelation.relation = this.calculateRelation(
        currentRelation.relationRating
      ) as RelationshipType;
      currentRelation.addNewMemory(
        interactionResponse.description,
        interactionResponse.relationshipChange
      );

      if (agent.goal && interactionResponse.milestoneComplete >= 1) {
        console.log(`${agent.name}: milestone completed`);
        if (!this.goal?.milestonesMet) {
          agent.goal.completedMilestones.push({
            description: agent.goal.currentMilestone!.description,
            interaction: interactionResponse.description
          });
        }
        agent.goal.currentMilestone =
          agent.goal.remainingMilestones!.pop() ?? null;
        if (agent.goal.currentMilestone === null)
          agent.goal.milestonesMet = true;
      }
    } catch (error: any) {
      console.warn(error);
    }
  }

  setGoal(newGoal: Goal) {
    this.goal = newGoal;
  }

  determineAction() {
    if (!this.goal?.milestonesMet) return this.goal?.currentMilestone?.type;
    return ActionType.GoalCompletion;
  }

  private calculateRelation(relationRating: number): string {
    if (relationRating <= -75) return 'abhor';
    if (relationRating <= -50) return 'hate';
    if (relationRating <= -25) return 'dislike';
    if (relationRating <= 24) return 'are indifferent to';
    if (relationRating <= 49) return 'like';
    if (relationRating <= 74) return 'are fond of';
    return 'emotionally invested in';
  }

  vote(candidates: Agent[]): Agent {
    const weightedCandidates: { candidate: Agent; weight: number }[] =
      candidates.map((candidate) => {
        const relationData = this.agentRelations[candidate.name];
        const weight = relationData ? relationData.relationRating : 0; // Default weight is 0
        return { candidate, weight };
      });

    const minWeight = Math.min(...weightedCandidates.map((c) => c.weight));
    const normalizedCandidates = weightedCandidates.map(
      ({ candidate, weight }) => ({
        candidate,
        weight: weight - minWeight + 1 // Ensure all weights are positive
      })
    );

    const totalWeight = normalizedCandidates.reduce(
      (sum, c) => sum + c.weight,
      0
    );

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
