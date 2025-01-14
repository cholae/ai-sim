import json
import random

class Goal:
    def __init__(self, description, goal_type):
        """
        Initialize a Goal instance.

        :param description: A brief description of the goal.
        :param goal_type: The type/category of the goal.
        """
        self.description = description
        self.type = goal_type

    def describe(self):
        """
        Return a descriptive string for the current goal.
        """
        return f"Current {self.type} goal: {self.description}"

    @staticmethod
    def load_trait_goals(filename):
        """
        Load trait-goal mappings from a JSON file.

        :param filename: Path to the JSON file containing trait-goal mappings.
        :return: A dictionary representing trait-goal mappings.
        """
        try:
            with open(filename, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            raise FileNotFoundError(f"File '{filename}' not found. Ensure the file exists and the path is correct.")
        except json.JSONDecodeError:
            raise ValueError(f"File '{filename}' contains invalid JSON. Please check the file format.")

    @staticmethod
    def assign_goal_based_on_trait(agent, filename="traits-and-goals.json"):
        """
        Assign a goal to an agent based on their trait.

        :param agent: The agent whose trait will determine the goal.
        :param filename: Path to the JSON file containing trait-goal mappings.
        :return: A Goal instance if a matching goal is found, or None otherwise.
        """
        try:
            trait_goals = Goal.load_trait_goals(filename)
            possible_goals = trait_goals.get(agent.trait)
            if possible_goals:
                # Randomly select a goal related to this trait
                selected_goal_data = random.choice(possible_goals['goals'])
                return Goal(selected_goal_data['description'], selected_goal_data['type'])
        except Exception as e:
            print(f"Error assigning goal based on trait: {e}")
        return None  # Return None if no matching goal is found
