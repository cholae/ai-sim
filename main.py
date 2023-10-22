from environment import Environment;
from objects import Object, Event, Resource, Effect;
from agent import Agent, Interaction;

try:
    env = Environment("Devland", 250, 100)
    res1 = Resource("Water", "the abundant water here comes from fresh water rivers pooling into a large freshwater lake",.97, .95, .99)
    res2 = Resource("Lumber", "with plenty of water in the area and a limited population, there is plenty of forest here",.92, .94, .15)
    env.add_object(res1)
    env.add_object(res2)
    print(env.describe())

    event1 = Event("Population Threshold 100", "Rise in population raised pollution levels in water", 0, "Population Increase", 0, -.05,0)
    env.add_object(event1)
    event1.apply_effect(res1, Effect(event1.impact,event1.description))
    print(env.describe())

    player = Agent("Cole", "Dark brown hair, nearly 6 feet tall", 24, "healthy", .5)
    print(player.describe())

    agent2 = Agent("Travis", "Short dark brown hair, loves chat gpt", 25, "healthy", .6)
    player.link_agent(agent2)
    print(player.agent_relations)

    player.add_interaction(agent2, Interaction("Got lunch together", 0.6))
    print(player.agent_relations)



except NameError as err:
    print(err)