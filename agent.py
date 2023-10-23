from objects import Object;

class Agent():
    def __init__(self, name, description, age, health, alignment):
        self.name = name
        self.description = description
        self.age = age                 # e.g., 24
        self.health = health           # e.g., "healthy", "sick", "injured"
        self.alignment = alignment       # e.g., -1 to 1 from evil to good

        # Knowledge
        self.resource_map = {}
        self.agent_relations = {}
        self.event_memory = []
        
        # Goals
        self.current_goal = None
        self.long_term_goals = []
        
        # Memories
        self.interaction_history = []
        self.location_history = []
        self.event_outcomes = []
        self.stablization = 1.0

        self.safety = 50
        self.hunger = 100
        self.thirst = 100

    def describe(self):
        #todo, check relations and if you know more, otherwise inform agent that you do not know the information
        return f"This is a human named {self.name} that looks {self.health}."
    
    def link_event(self, obj):
        self.event_memory[obj.name] = obj
    
    def link_agent(self, agent, rr=0.0):
        self.agent_relations[agent.name] = {
                                            "relation": "neutral",
                                            "relation_rating": rr,
                                            "interactions": ["Initial Meeting"] 
                                           }
    
    def add_interaction(self, agent, interaction):
        try:
            print(agent.name + " is giving the rr")
            print(self.name + " is recieving the rr")
            self.agent_relations[agent.name]["relation_rating"] += interaction.relation_impact
            rr = self.agent_relations[agent.name]["relation_rating"]
            if rr >= .5:
                self.agent_relations[agent.name]["relation"] = "friends"
            elif rr < .5 and rr >= 0:
                self.agent_relations[agent.name]["relation"] = "neutral"
            else:
                self.agent_relations[agent.name]["relation"] = "enemies"

            self.agent_relations[agent.name]["interactions"].append(interaction.description)
        except KeyError:
            self.link_agent(agent, interaction.relation_impact)

    #voting mechanism for groups
    def vote(self, members):
        #set vote to first member
        curVoteMember = members[0]

        #check if member is self
        if(curVoteMember == self):
            curVoteMember = members[1]

        #check if member is a known relation
        try:
            self.agent_relations[curVoteMember.name]
        except KeyError:
            self.link_agent(curVoteMember)

        #loop through group members, check relations for highest relation to current Agent
        for member in members:
            try:
                curRel = self.agent_relations[member.name]
            except:
                curRel = None
            if curRel: #if relationship exists check rating
                if curRel["relation_rating"] > self.agent_relations[curVoteMember.name]["relation_rating"]:
                    curVoteMember = member
        curVoteMember.add_interaction(self, Interaction("Voted for me during an election", .05))
        return curVoteMember


class Interaction():
    def __init__(self, description, relation_impact):
        self.description = description
        self.relation_impact = relation_impact