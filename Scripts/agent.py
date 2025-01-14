import random
import names
import json
from Scripts.goal import Goal
from Scripts.interaction import Interaction

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
            self.current_location = location
            self.initialize_defaults()

    def initialize_defaults(self):
        self.resource_map = {}
        self.agent_relations = {}
        self.event_memory = []
        self.interaction_history = []
        self.location_history = []
        self.event_outcomes = []
        self.stabilization = 1.0
        self.safety = 50
        self.hunger = 100
        self.thirst = 100
        self.current_goal = None
        self.long_term_goals = []

    def randomize_agent(self):
        self.sex = "male" if random.randint(0, 1) else "female"
        self.name = names.get_full_name(gender=self.sex)
        self.age = random.randint(18, 45)
        self.health = "healthy"
        self.alignment = random.uniform(-1, 1)
        self.description = f"You are {self.name}, a {self.age}-year-old {self.health} {self.sex}."
        self.trait = self.assign_random_trait()
        self.current_goal = Goal.assign_goal_based_on_trait(self)
        self.current_location = "Greenrest"
        self.initialize_defaults()

    def assign_random_trait(self, filename="traits.json"):
        with open(filename, 'r') as file:
            trait_goals = json.load(file)
        return random.choice(list(trait_goals.keys()))

    def describe(self):
        return f"{self.description} Traits: [{self.trait}] You have the current goal of {self.current_goal.description if self.current_goal else 'None'}."

    def link_agent(self, agent):
        if not self.is_agent_linked(agent):
            self.agent_relations[agent.name] = {"relation": "neutral", "relation_rating": 0, "interactions": []}
            agent.link_agent(self)

    def is_agent_linked(self, agent):
        return agent.name in self.agent_relations

    def add_interaction(self, agent, interaction):
        self.link_agent(agent)
        response_data = self.simulate_interaction(agent, interaction)
        self.update_relation(agent, response_data)

    def simulate_interaction(self, agent, interaction):
        # Placeholder for simulation logic
        return {"relationshipChange": 0.1, "description": "A positive interaction."}

    def update_relation(self, agent, response_data):
        relation_info = self.agent_relations[agent.name]
        relation_info["relation_rating"] += response_data["relationshipChange"]
        rr = relation_info["relation_rating"]
        if rr >= 0.5:
            relation_info["relation"] = "friends"
        elif -0.1 <= rr < 0.5:
            relation_info["relation"] = "indifferent"
        elif -0.5 <= rr < -0.1:
            relation_info["relation"] = "adversary"
        else:
            relation_info["relation"] = "foe"
        relation_info["interactions"].append(response_data["description"])