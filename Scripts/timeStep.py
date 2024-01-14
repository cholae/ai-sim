class TimeStep:
    def __init__(self):
        self.current_step = 0

    def step(self, agents):
        self.current_step += 1
        print(f"Time Step: {self.current_step}")

        for agent in agents:
            agent.take_action(self.current_step)