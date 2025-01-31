import { Agent } from './agent';

export class Structure {
  owner: Agent;
  name: string;
  description: string;
  constructor(name: string, description: string, owner: Agent) {
    this.name = name;
    this.description = description;
    this.owner = owner;
  }
}
