import { useEffect } from "react";
import { Agent } from "../interfaces/Agent";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { setAgents } from "../store/agentSlice";

const AgentList = () => {
  const agents = useSelector((state: RootState) => state.agents.agents); // Load agents from Redux
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleGenerateAgents = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/generate");
      const data: Agent[] = await response.json();
      dispatch(setAgents(data)); // Store agents in Redux
    } catch (error) {
      console.error("Failed to generate agents:", error);
    }
  };

  const handleRowClick = (agentId: string) => {
    navigate(`/agent/${agentId}`); // Navigate to the agent detail page
  };

  const sortedAgents = [...agents].sort((a, b) => b.completedGoals.length - a.completedGoals.length);

  return (
    <div className="width-sm flex flex-col justify-center bg-sky-800 max-w-screen-lg mx-auto py-8">
      <h1 className="text-4xl text-center underline pb-8">Agent List</h1>
      {agents.length === 0 ? (
        <button
          className="bg-slate-400 max-w-s mx-auto px-6 py-2 rounded-md text-white hover:bg-slate-500"
          onClick={handleGenerateAgents}
        >
          Generate Agents
        </button>
      ) : (
        <table>
          <thead>
            <tr className="bg-gray-700 text-white">
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Trait</th>
              <th>Completed Goals</th>
            </tr>
          </thead>
          <tbody>
            {sortedAgents.map((agent) => (
              <tr
                key={agent.id}
                className="cursor-pointer hover:bg-sky-900"
                onClick={() => handleRowClick(agent.id)}
              >
                <td>{agent.name}</td>
                <td>{agent.age}</td>
                <td>{agent.sex}</td>
                <td>{agent.trait}</td>
                <td>{agent.completedGoals.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AgentList;
