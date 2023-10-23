from environment import Environment;
from objects import Object, Event, Resource, Effect;
from agent import Agent, Interaction;
from group import Group;

try:
    env = Environment("Devland", 250, 100)
    res1 = Resource("Water", "the abundant water here comes from fresh water rivers pooling into a large freshwater lake",.97, .95, .99)
    res2 = Resource("Lumber", "with plenty of water in the area and a limited population, there is plenty of forest here",.92, .94, .15)
    env.add_object(res1)
    env.add_object(res2)

    event1 = Event("Population Threshold 100", "Rise in population raised pollution levels in water", 0, "Population Increase", 0, -.05,0)
    env.add_object(event1)
    event1.apply_effect(res1, Effect(event1.impact,event1.description))

    player = Agent("Cole", "Dark brown hair, nearly 6 feet tall", 24, "healthy", .5)
    

    agent2 = Agent("Travis", "Short dark brown hair, loves chat gpt", 25, "healthy", .5)
    agent2.link_agent(player)
    

    agent2.add_interaction(player, Interaction("Beat him in fantasy football", -0.6))

    agent3 = Agent("Matt", "UPS Driver. Father of Cole", 50, "healthy", .5)
    agent2.link_agent(agent3)
    player.link_agent(agent3, .5)

    group = Group("Beeg Coalition")
    group.add_member(player)
    group.add_member(agent2)
    group.add_member(agent3)
    print("An election is taking place.")
    group.elect_leader()

    print("Cole has relations: ")
    print(player.agent_relations)

    print("Travis has relations:")
    print(agent2.agent_relations)

    print("Matt has relations:")
    print(agent3.agent_relations)


except NameError as err:
    print(err)