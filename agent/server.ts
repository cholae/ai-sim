import express from "express";
import { Agent } from "./classes/agent";
import cors from "cors";

const app = express();
const PORT = 4000;
app.use(cors());

var agents: Agent[] = [];

// Example route to fetch agent data
app.get("/api/generate", (req, res) => {
  agents = [
    new Agent({randomInit:true}),
    new Agent({randomInit:true}),
    new Agent({randomInit:true}),
    new Agent({randomInit:true}),
    new Agent({randomInit:true}),
    new Agent({randomInit:true})
]
  res.status(200).json(agents);
});

app.get("/api/agent/:id", (req, res)=>{
  const agent = agents.find((a)=>a.id === req.params.id);
  if(agent){
    res.status(200).json(agent)
  }else{
    res.status(404).json({message:"Agent not found."});
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Back-end server is running at http://localhost:${PORT}`);
});
