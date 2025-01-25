import { Action } from "../interfaces/action";
import { Agent } from "./agent";
import { AI } from "./ai";
import { Goal } from "./goal";

export class Interaction implements Action{
    private agentA: Agent;
    private agentB: Agent;
  
    constructor(agentA: Agent, agentB: Agent) {
      this.agentA = agentA;
      this.agentB = agentB;
    }

    async execute(ai:AI): Promise<void> {
        this.agentA.linkAgent(this.agentB);

        const prompt = this.createInteractionPrompt(this.agentA, this.agentB)
        let response:any = await ai.generateFromPrompt(prompt);
        console.log(response);
    
        // Apply relationship change, check if goal was completed
        const updateAgentA = this.agentA.checkInteraction(this.agentB, response[this.agentA.id]);
        const updateAgentB = this.agentB.checkInteraction(this.agentA, response[this.agentB.id]);

        //check if we need to update goals
        try{
          if(updateAgentA){
            let goalA: any = await ai.generateFromPrompt(Goal.createGoalBasedOnTraitPrompt(this.agentA));
            console.log(goalA);
            this.agentA.setGoal(new Goal(goalA.description, goalA.milestones))
          }
          if(updateAgentB){
            let goalB:any = await ai.generateFromPrompt(Goal.createGoalBasedOnTraitPrompt(this.agentB));
            console.log(goalB);
            this.agentB.setGoal(new Goal(goalB.description, goalB.milestones))
          }
        }catch (error:any){
          console.warn({message:"failed to add new goal", error: error})
        }
    }

    createInteractionPrompt(agentA: Agent, agentB: Agent): string {
      const prompt = `
      Agent A:
          - Name: ${agentA.name}
          - Id: ${agentA.id}
          - ${agentA.goal?.describe() + " Has your goal met its milestones? **" + agentA.goal?.milestonesMet + "**"}
          - Description: ${agentA.describe()}
          - Relationship with ${agentB.name}: You ${agentA.agentRelations[agentB.id].relation} them.
          - Memories of ${agentB.name}: ${agentA.agentRelations[agentB.id].describeMemories() || "No significant memories yet."}
      
      Agent B:
          - Name: ${agentB.name}
          - Id: ${agentB.id}
          - ${agentB.goal?.describe() + " Has your goal met its milestones? **" + agentB.goal?.milestonesMet + "**"}
          - Description: ${agentB.describe()}
          - Relationship with ${agentA.name}: You ${agentB.agentRelations[agentA.id].relation} them.
          - Memories of ${agentA.name}: ${agentB.agentRelations[agentA.id].describeMemories() || "No significant memories yet."}
      
      ### Context:
      - **Relationship Score:** Ranges from -100 (extreme hatred) to +100 (strong love). Changes occur gradually and are not extreme in one interaction, unless the interacton requires it (e.g. attempted murder).
      
      ### Task:
      1. **Describe the Interaction**: Use agent information to summarize an interaction (e.g., conversation, activity, or conflict).
      2. **Evaluate Milestone Completion**: Milestones are completed only if:
          - **Alignment**: The interaction directly contributes to BOTH agent's milestone requirements.
          - **Relation**: The agents have POSITIVE relations.
          - YOU MUST EVALUATE MILESTONE COMPLETION FOR **BOTH AGENTS** DURING THIS INTERACTION.
      3. **Failure**:
          - If a milestone or goal attempt fails, provide logical consequences:
            - Example: deteriorating relationships or reduced trust between agents.
          - Someone with a trait or job unrelated to a milestone **CANNOT** help completed it. (e.g. a Bard cannot complete Builder tasks)
      
      ### Output Format:
      \`\`\`json
      {
        "description": "Summarize the interaction, reasoning for milestone/goal achievement, and relationship change.",
        "${agentA.id}": {
          "relationshipChange": <number>,
          "memoryStrength": <absolute value of relationshipChange>,
          "achievedMilestone": true/false value for if ${agentA.name} achieved their milestone of ${agentA.goal?.currentMilestone} **DURING** this interaction,
          "achievedGoal": true/false value for if ${agentA.name} achieved their milestone of ${agentA.goal?.description} **DURING** this interaction,
        },
        "${agentB.id}": {
          "relationshipChange": <number>,
          "memoryStrength": <absolute value of relationshipChange>,
          "achievedMilestone": true/false value for if ${agentB.name} achieved their milestone of ${agentB.goal?.currentMilestone} **DURING** this interaction,
          "achievedGoal": true/false value for if ${agentB.name} achieved their milestone of ${agentB.goal?.description} **DURING** this interaction,
        }
      }
      \`\`\`
      `;
      console.log(prompt);
      return prompt; 
    }
}