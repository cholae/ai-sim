from environment import Environment;
from objects import Object, Event, Resource, Effect;
from agent import Agent, Interaction;
from group import Group;
from timeStep import TimeStep;
from goal import Goal;
import random
import tkinter as tk
from tkinter import messagebox

try:
    # env = Environment("Devland", 250, 100)
    # res1 = Resource("Water", "the abundant water here comes from fresh water rivers pooling into a large freshwater lake",.97, .95, .99)
    # res2 = Resource("Lumber", "with plenty of water in the area and a limited population, there is plenty of forest here",.92, .94, .15)
    # env.add_object(res1)
    # env.add_object(res2)

    # event1 = Event("Population Threshold 100", "Rise in population raised pollution levels in water", 0, "Population Increase", 0, -.05,0)
    # env.add_object(event1)
    # event1.apply_effect(res1, Effect(event1.impact,event1.description))

    # player = Agent("Cole", "Dark brown hair, nearly 6 feet tall", "male", 24, "healthy", .5)
    

    # agent2 = Agent("Travis", "Short dark brown hair, loves chat gpt","male", 25, "healthy", .5)
    # agent2.link_agent(player)
    

    # agent2.add_interaction(player, Interaction("Beat him in fantasy football", -0.6))

    # agent3 = Agent("Matt", "UPS Driver. Father of Cole","male", 50, "healthy", .5)
    # agent2.link_agent(agent3)
    # player.link_agent(agent3, .5)

    # group = Group("Beeg Coalition")
    # group.add_member(player)
    # group.add_member(agent2)
    # group.add_member(agent3)
    # print("An election is taking place.")
    # group.elect_leader()

    

    # agent2.add_interaction(player, Interaction("Saved his family from a burning building", 0.7))
    # agent3.add_interaction(player, Interaction("Hung out a few times", 0.03))

    # print("An election is taking place.")
    # group.elect_leader()

    # print("Cole has relations: ")
    # print(player.agent_relations)

    # print("Travis has relations:")
    # print(agent2.agent_relations)

    # print("Matt has relations:")
    # print(agent3.agent_relations)

    # agent4 = Agent(random_init=True)
    # print(agent4.description)

    #meet_friend = Goal('Meet a new person', 5, 5, 1, 1, action, criteria)

    timeline = TimeStep()

    currAgents = []
    for x in range(10):
        currAgents.append(Agent(random_init=True))
    
    
    for t in range(4):
        agentsMeeting = []
        for agent in currAgents:
            num = random.randint(0,10)
            if num >= 9:
                agentsMeeting.append(agent)
        if len(agentsMeeting) >= 2:
            for m in range(len(agentsMeeting)-1):
                if m != len(agentsMeeting):
                    agentsMeeting[m].link_agent(agentsMeeting[m+1])
        timeline.step(currAgents)
    
    for agent in currAgents:
        print(agent.name + " has relations")
        print(agent.agent_relations)

except NameError as err:
    print(err)




def show_agent_details():
    selected_index = agent_listbox.curselection()[0]
    selected_agent = currAgents[selected_index]
    details = selected_agent.agent_relations
    details_label.config(text=details)

# Create the main window
root = tk.Tk()
root.title("Agent Network")

# Create a Listbox to display a list of agents
agent_listbox = tk.Listbox(root)
for x in range(len(currAgents)):
    agent_listbox.insert(x, currAgents[x].name)
agent_listbox.pack()

# Create a Button to show details of the selected agent
details_button = tk.Button(root, text="Show Details", command=show_agent_details)
details_button.pack()

# Label for displaying the details
details_label = tk.Label(root, text="Select an agent to view details")
details_label.pack()

# Start the GUI event loop
root.mainloop()