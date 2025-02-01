import { Group } from './group';
import { Agent } from './agent';
import { Structure } from './structure';

export class Settlement {
  name: string;
  agentIds: string[];
  structures: Structure[];
  groups: Group[];
  availableJobs: Set<string>;

  constructor(name: string) {
    this.name = name;
    this.agentIds = [];
    this.structures = [];
    this.groups = [];
    this.availableJobs = new Set<string>();
  }

  assignAgent(agent: Agent) {
    this.agentIds.push(agent.id);
    if (agent.job) {
      this.availableJobs.add(agent.job);
    }
  }

  describeJobs(): string {
    return [...this.availableJobs].join('\n'); // Convert Set to array and join with newlines
  }
}
