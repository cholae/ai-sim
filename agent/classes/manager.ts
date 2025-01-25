import { Agent } from "../classes/agent";
import { Interaction } from "../classes/interaction";
import { Action } from "../interfaces/action";
import { AI } from "./ai";
import { Goal } from "./goal";

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
    
    async progressDay(): Promise<Agent[]> {
        this.currentDay++;
        console.log(`Day ${this.currentDay} begins.`);
        let interactingAgents =  this.determineAgentActions();

        this.queueDailyInteractions(interactingAgents)

        while (this.actionQueue.length > 0) {
            const action = this.actionQueue.shift()!;
            await action.execute(this.ai);
        }
       
        return this.agents;
    }

    getCurrentDay(): number {
        return this.currentDay;
    }

    setAgents(agents: Agent[]): void{
        this.agents = agents;
    }

    getAgents(): Agent[]{
        return this.agents;
    }

    addAgent(agent: Agent): void {
        this.agents.push(agent);
    }

    async createAgents(numAgents: number): Promise<void>{
       for (let i = 0; i < numAgents; i++){
        try{
            console.log('Generating agent: ' + i);
            const agent = new Agent({randomInit:true})
            const newGoal: any = await this.ai.generateFromPrompt(Goal.createGoalBasedOnTraitPrompt(agent))
            console.log(newGoal);
            agent.setGoal(new Goal(newGoal.description, newGoal.milestones))
            this.addAgent(agent);
        } catch(error:any){
            console.error({message: "failed to create agent", error:error})
        }
       }
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
        let remainingAgentCount = agents.length;
        while (remainingAgentCount > 1) {
            const agentA = agents.pop()!;
            remainingAgentCount--;
        
            const randomIndex = Math.floor(Math.random() * remainingAgentCount);
            const agentB = agents.splice(randomIndex, 1)[0];
            remainingAgentCount--;
        
            // Add the interaction
            this.addAction(new Interaction(agentA, agentB));
        }
    
        // Handle case where there's one leftover agent
        if (remainingAgentCount === 1) {
            agents.pop();
        }
    }
    
    // Add an action to the queue
    addAction(action: Action): void {
        this.actionQueue.push(action);
    } 
}