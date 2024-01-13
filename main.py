from environment import Environment;
from objects import Object, Event, Resource, Effect;
from agent import Agent, Interaction;
from group import Group;
from timeStep import TimeStep;
from goal import Goal;
from gui import GUI;
import random


try:
    # env = Environment("Devland", 250, 100)
    # res1 = Resource("Water", "the abundant water here comes from fresh water rivers pooling into a large freshwater lake",.97, .95, .99)
    # res2 = Resource("Lumber", "with plenty of water in the area and a limited population, there is plenty of forest here",.92, .94, .15)
    # env.add_object(res1)
    # env.add_object(res2)

    # event1 = Event("Population Threshold 100", "Rise in population raised pollution levels in water", 0, "Population Increase", 0, -.05,0)
    # env.add_object(event1)
    # event1.apply_effect(res1, Effect(event1.impact,event1.description))

    #initialize time functions
    timeline = TimeStep()

    #generate random agents
    currAgents = []
    for x in range(10):
        currAgents.append(Agent(random_init=True))
    
    
    for t in range(4):
        agentsInteracting = []
        for agent in currAgents:
            num = random.randint(0,10)
            if num >= 9:
                agentsInteracting.append(agent)
        if len(agentsInteracting) >= 2:
            for agentIndex in range(len(agentsInteracting)-1):
                if agentIndex != len(agentsInteracting):
                    agentsInteracting[agentIndex].link_agent(agentsInteracting[agentIndex+1])
        #timeline.step(currAgents)
    
    for agent in currAgents:
        print()
        print(f"{agent.name} has the goal \"{agent.current_goal.description}\" and trait {agent.trait}. They have the following relations:\n")
        print(agent.agent_relations)

except NameError as err:
    print(err)


app = GUI(currAgents)
app.run()
