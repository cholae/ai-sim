class Group:
    def __init__(self, name, leader=None):
        self.name = name
        self.members = []
        self.leader = leader
        self.relations = {}

    def add_member(self, agent):
        self.members.append(agent)

    def remove_member(self, agent):
        self.members.remove(agent)
        if(agent == self.leader):
            self.elect_leader()

    def group_action(self):
        # Define group-level actions. The action might depend on the leader's decision,
        # a consensus mechanism, or other factors.
        pass

    def elect_leader(self, candidates=None):
        if candidates is None:
            candidates = self.members
        
        votes = {}
        for member in self.members:
            vote = member.vote(candidates)
            print(member.name + " voted for " + vote.name)  # Assume each agent has a 'vote' method
            votes[vote] = votes.get(vote, 0) + 1
        
        max_votes = max(votes.values(), default=0)
        top_candidates = [agent for agent, vote_count in votes.items() if vote_count == max_votes]
        print(top_candidates)
        # If there's a single leader, or the current leader is among the tied candidates
        if len(top_candidates) == 1:
            self.leader = top_candidates[0]
            print(self.leader.name + " was elected as leader of " + self.name)
        elif (self.leader in top_candidates):
            print(self.leader.name + " was re-elected.")
        else:
            # Recurse with the tied members
            self.elect_leader(candidates=top_candidates)
            
