import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Agent } from "../interfaces/Agent";
import AgentGoals from "./AgentGoals";

const AgentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const navigate = useNavigate();

  const handleReturnToList = () => {
    navigate(`/`); // Navigate to the agent detail page
  };

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/agent/${id}`);
        const data: Agent = await response.json();
        setAgent(data);
      } catch (error) {
        console.error("Error fetching agent details:", error);
      }
    };

    fetchAgent();
  }, [id]);

  if (!agent) {
    return <div>Loading...</div>;
  }

  return (
      <div className="width-sm flex flex-row justify-center bg-sky-800 max-w-screen-lg mx-auto p-8">
        <div>
          <div className="flex flex-row items-center justify-between pb-8">
            <button className="text-xl text-sky-950 bg-slate-400 px-4 py-2 rounded-md hover:bg-slate-500" onClick={(handleReturnToList)}>
              Return
            </button>
            <h1 className="text-4xl text-center underline mx-auto text-white">{agent.name}</h1>
          </div>
          <p><strong>Age:</strong> {agent.age}</p>
          <p><strong>Sex:</strong> {agent.sex}</p>
          <p><strong>Trait:</strong> {agent.trait}</p>
          <p><strong>Description:</strong> {agent.description}</p>
          <p><strong>Current Goal:</strong> {agent.goal.description}</p>
          <p><strong>Current Milestone:</strong> {agent.goal.currentMilestone?.description}</p>
          <p><strong>Completed Goals:</strong> {agent.completedGoals.length}</p>
        </div>

        <div className="width-sm flex flex-col justify-center mx-auto">
          <AgentGoals data={agent.completedGoals}/>
        </div>
      </div>
  );
};

export default AgentDetails;
