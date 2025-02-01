import { Agent } from '../classes/agent';
import { Interaction } from '../classes/interaction';
import { ActionType } from '../enums/actionType';
import { Action } from '../interfaces/action';
import { AI } from './ai';
import { Goal } from './goal';
import { GoalAction } from './goalAction';
import { IndividualAction } from './individualAction';
import { Milestone } from './milestone';
import { Settlement } from './settlement';

export class Manager {
  private currentDay: number;
  private actionQueue: Action[];
  private agents: Agent[];
  private ai: AI;
  private settlements: Settlement[];

  constructor(agents: Agent[], ai: AI) {
    this.ai = ai;
    this.currentDay = 0;
    this.actionQueue = [];
    this.agents = agents;
    this.settlements = [];
  }

  async progressDay(): Promise<Agent[]> {
    this.currentDay++;
    console.log(`Day ${this.currentDay} begins.`);

    this.queueDailyActions();

    while (this.actionQueue.length > 0) {
      const action = this.actionQueue.shift()!;
      const result = await action.execute(this.ai);
    }

    return this.agents;
  }

  getCurrentDay(): number {
    return this.currentDay;
  }

  setAgents(agents: Agent[]): void {
    this.agents = agents;
  }

  getAgents(): Agent[] {
    return this.agents;
  }

  addAgent(agent: Agent): void {
    this.agents.push(agent);
  }

  async createAgents(numAgents: number): Promise<void> {
    if (this.settlements.length === 0) {
      this.settlements.push(new Settlement('Stormwind'));
    }
    const settlement = this.settlements[0];
    for (let i = 0; i < numAgents; i++) {
      try {
        console.log('Generating agent: ' + i);
        const agent = new Agent({ randomInit: true });
        settlement.assignAgent(agent);
        agent.home = settlement;
        const newGoal: any = await this.ai.generateFromPrompt(
          Goal.createGoalBasedOnTraitPrompt(agent, settlement)
        );
        const parsedMilestones = newGoal.milestones.map(
          (m: any) => new Milestone(m.description, m.requirements, m.type)
        );
        agent.setGoal(new Goal(newGoal.description, parsedMilestones));
        this.addAgent(agent);
      } catch (error: any) {
        console.error({ message: 'failed to create agent', error: error });
      }
    }
    console.log(settlement.describeJobs());
  }

  private determineAgentActions(): Map<ActionType, Agent[]> {
    let agentMap: Map<ActionType, Agent[]> = new Map();

    this.agents.forEach((agent) => {
      let action = agent.determineAction()!;

      if (!agentMap.has(action)) {
        agentMap.set(action, []);
      }
      agentMap.get(action)?.push(agent);
    });

    return agentMap;
  }

  private queueDailyActions(): void {
    // Get agents grouped by their actions
    const agentMap = this.determineAgentActions();

    // Queue GoalCompletion actions
    if (agentMap.has(ActionType.GoalCompletion)) {
      agentMap.get(ActionType.GoalCompletion)!.forEach((agent) => {
        console.log(
          `!!! ${agent.name} is attempting to complete a Major Goal!`
        );
        this.addAction(new GoalAction(agent));
      });
    }

    // Queue IndividualActions
    if (agentMap.has(ActionType.IndividualAction)) {
      agentMap.get(ActionType.IndividualAction)!.forEach((agent) => {
        this.addAction(new IndividualAction(agent));
      });
    }

    // Queue Interactions (require pairs)
    if (agentMap.has(ActionType.Interaction)) {
      let interactionAgents = [...agentMap.get(ActionType.Interaction)!]; // Clone array to avoid modifying the map

      while (interactionAgents.length > 1) {
        const agentA = interactionAgents.pop()!;
        const randomIndex = Math.floor(
          Math.random() * interactionAgents.length
        );
        const agentB = interactionAgents.splice(randomIndex, 1)[0];

        this.addAction(new Interaction(agentA, agentB));
      }

      // If one agent is left, they perform a solo interaction
      if (interactionAgents.length === 1) {
        interactionAgents.pop()!;
      }
    }
  }

  // Add an action to the queue
  addAction(action: Action): void {
    this.actionQueue.push(action);
  }
}
