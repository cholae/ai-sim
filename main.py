from Scripts.environment import Environment;
from Scripts.objects import Object, Event, Resource, Effect;
from Scripts.agent import Agent, Interaction;
from Scripts.group import Group;
from Scripts.timeStep import TimeStep;
from Scripts.goal import Goal;
from Scripts.gui import GUI;
import random
import ollama;

try:
    response = ollama.generate(
       model='mistral-openorca', 
       prompt="""You are an experienced adventurer discussing a new type of monster with a naive and rude young adventurer. Respond in JSON with the following attributes: 
        {{
            relationshipChange: value on a scale between -1 and 1 where 0 means the two agent's relationship did not change due to the interaction.
            description: a short description of the interaction and why the relationshipChange value was chosen.
        }}""",
       format="json",
       stream=False)
    print(response['response'])
except ollama.ResponseError as e:
  print('Error:', e.error)

# try:
#     #initialize time functions
#     timeline = TimeStep()

#     #generate random agents
#     currAgents = []
#     for x in range(10):
#         currAgents.append(Agent(random_init=True))
    
    
#     for t in range(2):
#         agentsInteracting = []
#         for agent in currAgents:
#             num = random.randint(0,10)
#             if num >= 9:
#                 agentsInteracting.append(agent)
#         if len(agentsInteracting) >= 2:
#             for agentIndex in range(len(agentsInteracting)-1):
#                 if agentIndex != len(agentsInteracting):
#                     agentsInteracting[agentIndex].link_agent(agentsInteracting[agentIndex+1])
#         #timeline.step(currAgents)
    
#     for agent in currAgents:
#         print()
#         print(f"{agent.name} has the goal \"{agent.current_goal.description}\" and trait {agent.trait}. They have the following relations:\n")
#         print(agent.agent_relations)

# except NameError as err:
#     print(err)



# app = GUI(currAgents)
# app.run()
