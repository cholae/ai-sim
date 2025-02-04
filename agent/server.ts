import express from 'express';
import cors from 'cors';
import { Manager } from './classes/manager';
import { AI } from './classes/ai';

const app = express();
const PORT = 4000;
app.use(cors());

const ai: AI = new AI('mistral');
const manager = new Manager([], ai);

// Example route to fetch agent data
app.get('/api/generate', async (req, res) => {
  const numAgents = parseInt((req.query.num as string) || '0');
  if (numAgents === 0) {
    res.status(400).json({ error: 'request a number of agents larger than 1' });
  } else {
    await manager.createAgents(numAgents);
    res.status(200).json(manager.getAgents());
  }
});

app.get('/api/agent/:id', (req, res) => {
  const agent = manager.getAgents().find((a) => a.id === req.params.id);
  if (agent) {
    res.status(200).json(agent);
  } else {
    res.status(404).json({ message: 'Agent not found.' });
  }
});

app.get('/api/progress', async (req, res) => {
  try {
    await manager.progressDay();

    res.status(200).json({
      message: `Day ${manager.getCurrentDay()} progressed.`,
      currentDay: manager.getCurrentDay(),
      agents: manager.getAgents()
    });
  } catch (error: any) {
    console.error('Error progressing day:', error);
    res
      .status(500)
      .json({ message: 'Failed to progress day.', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Back-end server is running at http://localhost:${PORT}`);
});
