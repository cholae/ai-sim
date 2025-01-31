import { Group } from './group';
import { Agent } from './agent';
import { Structure } from './structure';

export class Settlement {
  name: string;
  agents: Agent[];
  structures: Structure[];
  groups: Group[];

  constructor(name: string) {
    this.name = name;
    this.agents = [];
    this.structures = [];
    this.groups = [];
  }

  assignAgent(agent: Agent) {
    this.agents.push(agent);
  }
}
