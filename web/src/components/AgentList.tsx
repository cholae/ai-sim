import React, { useEffect, useState } from "react";
import AgentCard from "./AgentCard";
import { Agent } from "../interfaces/Agent";

const AgentList: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    // Replace this URL with your actual API endpoint
    const fetchAgents = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/start");
        const data: Agent[] = await response.json();
        setAgents(data);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div style={styles.container}>
      <h1>Agent List</h1>
      <div style={styles.grid}>
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "16px",
    fontFamily: "'Arial', sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
  },
};

export default AgentList;
