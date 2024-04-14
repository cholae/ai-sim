from Scripts.environment import Environment;
from Scripts.objects import Object, Event, Resource, Effect;
from Scripts.agent import Agent, Interaction;
from Scripts.group import Group;
from Scripts.timeStep import TimeStep;
from Scripts.goal import Goal;
from Scripts.gui import GUI;
import random


try:
    #initialize time functions
    timeline = TimeStep()

    #generate random agents
    currAgents = []
    for x in range(10):
        currAgents.append(Agent(random_init=True))
    
    for t in range(2):
        agentsInteracting = []
        for agent in currAgents:
            num = random.randint(0,10)
            if num >= 8:
                agentsInteracting.append(agent)
        if len(agentsInteracting) >= 2:
            for agentIndex in range(len(agentsInteracting)-1):
                if agentIndex != len(agentsInteracting):
                    agentsInteracting[agentIndex].add_interaction(agentsInteracting[agentIndex+1], Interaction("You are having a meeting to discuss your goals."))
        #timeline.step(currAgents)

except NameError as err:
    print(err)



app = GUI(currAgents)
app.run()
