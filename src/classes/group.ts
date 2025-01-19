import { Agent } from "./agent"; // Import your Agent class

export class Group {
  name: string;
  members: Agent[] = [];
  leader: Agent | null = null;
  relations: Record<string, any> = {};

  constructor(name: string, leader: Agent | null = null) {
    this.name = name;
    this.leader = leader;
  }

  addMember(agent: Agent): void {
    this.members.push(agent);
  }

  removeMember(agent: Agent): void {
    this.members = this.members.filter(member => member !== agent);
    if (agent === this.leader) {
      this.electLeader();
    }
  }

  groupAction(): void {
    // Define group-level actions here
  }

  electLeader(candidates: Agent[] | null = null): void {
    if (!candidates) {
      candidates = this.members;
    }

    const votes: Map<Agent, number> = new Map();

    for (const member of this.members) {
      const vote = member.vote(candidates);
      console.log(`${member.name} voted for ${vote.name}`);
      votes.set(vote, (votes.get(vote) || 0) + 1);
    }

    const maxVotes = Math.max(...Array.from(votes.values()));
    const topCandidates = Array.from(votes.entries())
      .filter(([_, voteCount]) => voteCount === maxVotes)
      .map(([agent]) => agent);

    if (topCandidates.length === 1) {
      this.leader = topCandidates[0];
      console.log(`${this.leader.name} was elected as leader of ${this.name}`);
    } else if (this.leader && topCandidates.includes(this.leader)) {
      console.log(`${this.leader.name} was re-elected.`);
    } else {
      this.electLeader(topCandidates);
    }
  }
}
