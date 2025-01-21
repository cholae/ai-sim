import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Agent } from "../interfaces/Agent";

interface AgentState {
  agents: Agent[];
}

const initialState: AgentState = {
  agents: [],
};

const agentSlice = createSlice({
  name: "agents",
  initialState,
  reducers: {
    setAgents(state, action: PayloadAction<Agent[]>) {
      state.agents = action.payload;
    },
    clearAgents(state) {
      state.agents = [];
    },
  },
});

export const { setAgents, clearAgents } = agentSlice.actions;
export default agentSlice.reducer;
