import json
import random
class Goal:
    def __init__(self, description, goal_type):
        self.description = description  # A brief description of the goal.
        self.type = goal_type
        #self.priority = priority  # A numeric value indicating the importance of the goal.
        #self.criteria = criteria #complex structure representing the criteria to achieve a goal

    def describe(self):
        return f"Current {self.type} goal: {self.description}"

    def load_trait_goals(filename):
        with open(filename, 'r') as file:
            data = json.load(file)
        return data
    
    def assign_goal_based_on_trait(agent):
        possible_goals = (Goal.load_trait_goals("traits-and-goals.json")).get(agent.trait)
        if possible_goals:
            # Randomly select one of the goals related to this trait
            selected_goal_data = random.choice(possible_goals['goals'])
            return Goal(selected_goal_data['description'], selected_goal_data['type'])
        return None  # Return None if no matching trait is found

