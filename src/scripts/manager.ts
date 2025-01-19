import { Agent } from "../classes/agent";
import { Interaction } from "../classes/interaction";
import { Action } from "../interfaces/action";
import { AI } from "./ai";

export class Manager{
    private currentDay: number;
    private actionQueue: Action[];
    private agents: Agent[];
    private ai: AI;
    
    constructor(agents: Agent[], ai:AI) {
        this.ai = ai;
        this.currentDay = 0;
        this.actionQueue = [];
        this.agents = agents;
    }
    
    progressDay(): void {
        console.log(`Day ${this.currentDay + 1} begins.`);
        let interactingAgents =  this.determineAgentActions();

        this.queueDailyInteractions(interactingAgents)

        while (this.actionQueue.length > 0) {
            const action = this.actionQueue.shift()!;
            action.execute(this.ai);
        }

        this.currentDay++;

    }

    private determineAgentActions(): Agent[] {
        let interactingAgents: Agent[] = [];

        this.agents.forEach(agent => {
            let action = agent.determineAction();
            if(action == 'interaction'){
                interactingAgents.push(agent);
            }
        });

        return interactingAgents;
    }
    
    private queueDailyInteractions(agents: Agent[]): void {
        while (agents.length > 1) {
            const agentA = agents.pop()!;
            const agentB = agents.pop()!;
            this.addAction(new Interaction(agentA, agentB));
        }
    
        // Handle case where there's one leftover agent
        if (agents.length === 1) {
            console.warn(`Agent ${agents[0].name} was not able to find an interaction partner.`);
            agents.pop();
        }
    }
    
    // Add an action to the queue
    addAction(action: Action): void {
        this.actionQueue.push(action);
    } 
}