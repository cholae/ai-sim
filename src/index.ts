import { AI } from "./scripts/ai";
import { Agent } from "./classes/agent";
import { Manager } from "./scripts/manager";

async function main() {
    const ai = new AI("mistral");

    let agents = [
        new Agent({randomInit:true}),
        new Agent({randomInit:true}),
        new Agent({randomInit:true})
    ]

    const manager = new Manager(agents, ai);
    
    let daysToSim = 2;
    for(let i = 0; daysToSim >= i; i++){
        manager.progressDay();
    }
}

main();