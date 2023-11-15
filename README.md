# ai-sim
Hybrid AI simulation environment
- Actively using a local AI to create decisions based on herusitics and descriptions of their current environments

# Higher level simulation (think DF)
- Agents are grouped and have indivdual goals, relations, etc. They can take actions individually (marriage, kill, etc.)
- Groups can take actions that require many people (building, voting, war, etc.)
- Environments determine value, healthyness, etc. of an area. e.g. a unhealthy area will experience more deaths/deaths earlier or a wealthier area may grow faster
- Simulation handles actions by batch job? i.e. here are all of the agents/groups that need to make decisions, make them.

# next steps
1. Agent Goals
    Evaluate goals define distance to goal (pattern should return a math equation for how close we are) (e.g. Thirst is 100. My need to look starts increasing at 50. So i have a .5 distance. Maybe priority is increased every step under .7?)

2. agent life cycles
3. Group Relations
4. Group Actions
5. Locations valued by resources
6. creation of buildings in locations
7. AI