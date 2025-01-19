import express from "express";
import { Agent } from "./classes/agent";
import cors from "cors";

const app = express();
const PORT = 4000;
app.use(cors());

// Example route to fetch agent data
app.get("/api/start", (req, res) => {
  let agents = [
    new Agent({randomInit:true}),
    new Agent({randomInit:true}),
    new Agent({randomInit:true}),
    new Agent({randomInit:true}),
    new Agent({randomInit:true}),
    new Agent({randomInit:true})
]
  res.json(agents);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Back-end server is running at http://localhost:${PORT}`);
});
