from Scripts.goal import Goal
from Scripts.interaction import Interaction
import random
import names
import json
import ollama

class Agent:
    def __init__(self, name=None, description="", sex=None, age=None, trait=None, health=None, alignment=None, location=None, random_init=False):
        if random_init:
            self.randomize_agent()
        else:
            self.name = name
            self.description = description
            self.trait = trait
            self.sex = sex
            self.age = age
            self.health = health
            self.alignment = alignment
            self.resource_map = {}
            self.agent_relations = {}
            self.event_memory = []
            self.trait = None
            self.current_goal = None
            self.long_term_goals = []
            self.current_location = location
            self.interaction_history = []
            self.location_history = []
            self.event_outcomes = []
            self.stabilization = 1.0
            self.safety = 50
            self.hunger = 100
            self.thirst = 100

    def randomize_agent(self):
        sex_num = random.randint(0, 1)
        self.sex = "male" if sex_num == 1 else "female"
        self.name = names.get_full_name(gender=self.sex)
        self.age = random.randint(18, 45)
        self.health = "healthy"
        self.alignment = random.uniform(-1, 1)
        self.description = f'You are {self.name}, a {self.age}-year-old {self.health} {self.sex}.'
        self.resource_map = {}
        self.agent_relations = {}
        self.event_memory = []
        self.trait = self.assign_random_trait()
        self.current_goal = Goal.assign_goal_based_on_trait(self)
        self.location = "Greenrest"
        self.interaction_history = []
        self.location_history = []
        self.event_outcomes = []
        self.stabilization = 1.0
        self.safety = 50
        self.hunger = 100
        self.thirst = 100

    def assign_random_trait(self, filename="traits-and-goals.json"):
        trait_goals = Goal.load_trait_goals(filename)
        traits = list(trait_goals.keys())
        return random.choice(traits)

    def describe(self):
        return f"{self.description} Traits: [{self.trait}] You have the current goal of {self.current_goal.description}."

    def link_event(self, obj):
        self.event_memory[obj.name] = obj

    def link_agent(self, agent):
        if not self.is_agent_linked(agent):
            self.agent_relations[agent.name] = {
                "relation": "neutral",
                "relation_rating": 0,
                "interactions": []
            }
            agent.link_agent(self)

    def is_agent_linked(self, agent):
        return agent.name in self.agent_relations

    def add_interaction(self, agent, interaction):
        self.link_agent(agent)
        interaction_prompt = f"""You are {self.describe()} having an interaction with {agent.describe()}. Your current relationship is {self.agent_relations[agent.name].get("relation", "You haven't met")}. Your interaction: {interaction.description} Respond in JSON with the following attributes: 
                {{
                    relationshipChange: value on a scale between -0.25 and 0.25 where .25 means a perfect positive interaction, 0 means you were indifferent to this interaction, and -.25 means you hated the interaction.
                    description: a short description of why the interaction was positive or negative.
                }}"""
        try:
            response = ollama.generate(
                model='mistral-openorca', 
                prompt=interaction_prompt,
                format="json",
                stream=False
            )
            response_data = json.loads(response['response'])
            print(response_data)
        except ollama.ResponseError as e:
            print('Error:', e.error)
        
        self.agent_relations[agent.name]["relation_rating"] += response_data["relationshipChange"]
        rr = self.agent_relations[agent.name]["relation_rating"]
        if rr >= .5:
            self.agent_relations[agent.name]["relation"] = "friends"
        elif .5 > rr >= -0.1:
            self.agent_relations[agent.name]["relation"] = "indifferent"
        elif -.1 > rr >= -.5:
            self.agent_relations[agent.name]["relation"] = "adversary"
        else:
            self.agent_relations[agent.name]["relation"] = "foe"
        self.agent_relations[agent.name]["interactions"].append(response_data["description"])

    def vote(self, members):
        cur_vote_member = members[0]
        if cur_vote_member == self:
            cur_vote_member = members[1]
        if cur_vote_member.name not in self.agent_relations:
            self.link_agent(cur_vote_member)
        for member in members:
            if member.name in self.agent_relations:
                cur_rel = self.agent_relations[member.name]
                if cur_rel["relation_rating"] > self.agent_relations[cur_vote_member.name]["relation_rating"]:
                    cur_vote_member = member
        cur_vote_member.add_interaction(self, Interaction("Voted for me during an election"))
        return cur_vote_member
