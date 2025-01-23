import express from "express";
import { Agent } from "./classes/agent";
import cors from "cors";
import { Manager } from "./scripts/manager";
import { AI } from "./scripts/ai";

const app = express();
const PORT = 4000;
app.use(cors());

const ai: AI = new AI('mistral')
const manager = new Manager([], ai);

// Example route to fetch agent data
app.get("/api/generate", (req, res) => {
  const agents = [
    new Agent({randomInit:true}),
    new Agent({randomInit:true}),
    new Agent({randomInit:true}),
    new Agent({randomInit:true}),
    new Agent({randomInit:true}),
    new Agent({randomInit:true})
]

  manager.setAgents(agents);
  res.status(200).json(agents);
});

app.get("/api/agent/:id", (req, res)=>{
  const agent = manager.getAgents().find((a)=>a.id === req.params.id);
  if(agent){
    res.status(200).json(agent)
  }else{
    res.status(404).json({message:"Agent not found."});
  }
})

app.get("/api/progress", async (req,res)=>{
  try {
    await manager.progressDay();

    res.status(200).json({
      message: `Day ${manager.getCurrentDay()} progressed.`,
      currentDay: manager.getCurrentDay(),
      agents: manager.getAgents(),
    });
  } catch (error:any) {
    console.error("Error progressing day:", error);
    res.status(500).json({ message: "Failed to progress day.", error: error.message });
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Back-end server is running at http://localhost:${PORT}`);
});
