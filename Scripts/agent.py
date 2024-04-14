from Scripts.objects import Object;
from Scripts.goal import Goal;
import random;
import names;
import ollama;
import json;

class Agent:
    def __init__(self, name=None, description="", sex=None, age=None, trait=None, health=None, alignment=None, location=None, random_init=False):
        if random_init:
            self.randomize_agent()
        else:
            self.name = name
            self.description = description
            self.trait = trait
            self.sex = sex
            self.age = age                 # e.g., 24
            self.health = health           # e.g., "healthy", "sick", "injured"
            self.alignment = alignment     # e.g., -1 to 1 from evil to good

            # Knowledge
            self.resource_map = {}
            self.agent_relations = {}
            self.event_memory = []
            
            # Traits and Goals
            self.trait = None
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
        self.description = f'You are {self.name}, a {self.age} year old {self.health} {self.sex}.'

        # Knowledge
        self.resource_map = {}
        self.agent_relations = {}
        self.event_memory = []
        
        # Goals
        self.trait = self.assign_random_trait()
        self.current_goal = Goal.assign_goal_based_on_trait(self)

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
        return f"{self.description} Traits: [{self.trait}] You have the current goal of {self.current_goal.description}."
    
    def assign_random_trait(self, filename="traits-and-goals.json"):
        # Load trait-goal data
        trait_goals = Goal.load_trait_goals(filename)
        
        # Extract the list of traits (keys of the dictionary)
        traits = list(trait_goals.keys())
        # Randomly select a trait
        selected_trait = random.choice(traits)

        # Assign the selected trait to the agent
        return selected_trait

    def link_event(self, obj):
        self.event_memory[obj.name] = obj
    
    def link_agent(self, agent):
        if self.is_agent_linked(agent):
            return
        else:
            self.agent_relations[agent.name] = {
                                                "relation": "neutral",
                                                "relation_rating": 0,
                                                "interactions": []
                                            }
            agent.link_agent(self)
        
    def is_agent_linked(self,agent):
        return self.agent_relations.__contains__(agent.name)
    
    def add_interaction(self, agent, interaction):
        self.link_agent(agent)
        interactionPrompt = f"""You are {self.describe()} having an interaction with {agent.describe()}. Your current relationship is {self.agent_relations[agent.name].get("relation", "You haven't met")}. Your interaction: {interaction.description} Respond in JSON with the following attributes: 
                {{
                    relationshipChange: value on a scale between -0.25 and 0.25 where .25 means a perfect positive interaction, 0 means you were indifferent to this interaction, and -.25 means you hated the interaction.
                    description: a short description of why the interaction was positive or negative.
                }}"""
        try:
            response = ollama.generate(
            model='mistral-openorca', 
            prompt=interactionPrompt,
            format="json",
            stream=False)
            response_data = json.loads(response['response'])
            print(response_data)
        except ollama.ResponseError as e:
            print('Error:', e.error)
    
        self.agent_relations[agent.name]["relation_rating"] += response_data["relationshipChange"]
        rr = self.agent_relations[agent.name]["relation_rating"]
        if rr >= .5:
            self.agent_relations[agent.name]["relation"] = "friends"
        elif rr < .5 and rr >= -0.1:
            self.agent_relations[agent.name]["relation"] = "indifferent"
        elif rr < -0.1 and rr >= -.5:
                self.agent_relations[agent.name]["relation"] = "adversary"
        else:
            self.agent_relations[agent.name]["relation"] = "foe"

        self.agent_relations[agent.name]["interactions"].append(response_data["description"])
            

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
        curVoteMember.add_interaction(self, Interaction("Voted for me during an election"))
        return curVoteMember
    
    # def take_action(self, timestep):
    #     # Evaluate goals at each step
    #     self.evaluate_goals(timestep)

    #     # Select action based on current goals
    #     if self.current_goal:
    #         action = self.current_goal.action()
    #         print(f"{self.name} takes action '{action}'")
    #     else:
    #         print(f"{self.name} has no goal and takes no action")


class Interaction():
    def __init__(self, description):
        self.description = description