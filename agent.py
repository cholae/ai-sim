from objects import Object;
import random;
import names;

class Agent:
    def __init__(self, name=None, description="", sex=None, age=None, health=None, alignment=None, location=None, random_init=False):
        if random_init:
            self.randomize_agent()
        else:
            self.name = name
            self.description = description
            self.sex = sex
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

            self.current_location = location
            
            # Memories
            self.interaction_history = []
            self.location_history = []
            self.event_outcomes = []
            self.stablization = 1.0

            self.safety = 50
            self.hunger = 100
            self.thirst = 100

    def randomize_agent(self):
        sexNum = random.randint(0,1)
        if(sexNum == 1):
            self.sex = "male"
        else:
            self.sex = "female"
        self.name = names.get_full_name(gender=self.sex)
        self.age = random.randint(18,45)
        self.health = "healthy"
        self.alignment = random.uniform(-1,1)
        self.description = f'This is {self.name}, a {self.age} year old {self.health} {self.sex}.'

        # Knowledge
        self.resource_map = {}
        self.agent_relations = {}
        self.event_memory = []
        
        # Goals
        self.current_goal = None
        self.goals = {}

        self.location = "Greenrest"
        
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
        return f"{self.description} They have a current goal of {self.current_goal}."
    
    def link_event(self, obj):
        self.event_memory[obj.name] = obj
    
    def link_agent(self, agent, rr=0.0):
        if self.is_agent_linked(agent):
            print('already linked')
        else:
            print(f"linking {agent.name} to {self.name}")
            self.agent_relations[agent.name] = {
                                                "relation": "neutral",
                                                "relation_rating": rr,
                                                "interactions": ["Initial Meeting"] 
                                            }
            agent.link_agent(self)
        
    def is_agent_linked(self,agent):
        return self.agent_relations.__contains__(agent.name)
    
    def add_interaction(self, agent, interaction):
        try:
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
    
    def evaluate_goals(self, timestep):
        # Logic to evaluate progress towards each goal
        # For example, checking if certain conditions are met
        for goal in self.goals:
            goal.evaluate(self, timestep)

    def take_action(self, timestep):
        # Evaluate goals at each step
        self.evaluate_goals(timestep)

        # Select action based on current goals
        if self.current_goal:
            action = self.current_goal.action()
            print(f"{self.name} takes action '{action}'")
        #else:
            #print(f"{self.name} has no goal and takes no action")


class Interaction():
    def __init__(self, description, relation_impact):
        self.description = description
        self.relation_impact = relation_impact