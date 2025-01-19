import React from "react";

interface Agent {
  id: string;
  name: string;
  description: string;
  sex: string;
  age: number;
  trait: string;
  currentGoal: {
    description: string;
    type: string;
  };
}

const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => {
  return (
    <div style={styles.card}>
      <h3>{agent.name}</h3>
      <p>{agent.description}</p>
      <p><b>Sex:</b> {agent.sex}</p>
      <p><b>Age:</b> {agent.age}</p>
      <p><b>Trait:</b> {agent.trait}</p>
      <p><b>Current Goal:</b> {agent.currentGoal.description} ({agent.currentGoal.type})</p>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    margin: "8px",
    backgroundColor: "#072dfe",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
  },
};

export default AgentCard;
