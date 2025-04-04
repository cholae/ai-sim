import { useEffect, useState, useRef } from 'react';
import { Agent } from '../interfaces/Agent';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { setAgents } from '../store/agentSlice';

const AgentList = () => {
  const agents = useSelector((state: RootState) => state.agents.agents);
  const isRunningRef = useRef(false);
  const [currentDay, setCurrentDay] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleGenerateAgents = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/generate?num=10');
      const data: Agent[] = await response.json();
      dispatch(setAgents(data)); // Store agents in Redux
    } catch (error) {
      console.error('Failed to generate agents:', error);
    }
  };

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStartStop = () => {
    isRunningRef.current = !isRunningRef.current; // Toggle running state
    if (isRunningRef.current) {
      progressDay(); // Start the simulation
    } else if (intervalRef.current) {
      clearTimeout(intervalRef.current); // Stop the simulation
      intervalRef.current = null;
    }
  };

  const progressDay = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/progress');
      const data = await response.json();
      dispatch(setAgents(data.agents));
      setCurrentDay(data.currentDay);
    } catch (error) {
      console.error('Failed to progress day:', error);
    }

    if (isRunningRef.current) {
      // Schedule the next day only if the simulation is still running
      intervalRef.current = setTimeout(progressDay, 3000);
    }
  };

  const handleRowClick = (agentId: string) => {
    navigate(`/agent/${agentId}`);
  };

  const sortedAgents = [...agents].sort(
    (a, b) => b.completedGoals.length - a.completedGoals.length
  );

  useEffect(() => {
    return () => {
      // Clean up the interval on unmount
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="width-sm flex flex-col justify-center bg-sky-800 max-w-screen-xl mx-auto py-8">
      <h1 className="text-4xl text-center underline pb-8">Agent List</h1>
      <p className="text-center text-white">Current Day: {currentDay}</p>
      {agents.length === 0 ? (
        <button
          className="bg-slate-400 max-w-s mx-auto px-6 py-2 rounded-md text-white hover:bg-slate-500"
          onClick={handleGenerateAgents}
        >
          Generate Agents
        </button>
      ) : (
        <div className="relative">
          <div className="flex">
            {/* Sticky Button */}
            <div className="sticky left-0 top-0 z-10 flex items-center h-fit p-4">
              <button
                className={`${
                  isRunningRef.current ? 'bg-red-500' : 'bg-green-500'
                } w-40 h-12 rounded-md text-white hover:opacity-90`}
                onClick={handleStartStop}
              >
                {isRunningRef.current ? 'Stop' : 'Start'} Simulation
              </button>
            </div>

            {/* Scrollable Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="p-4">Name</th>
                    <th className="p-4">Age</th>
                    <th className="p-4">Sex</th>
                    <th className="p-4">Trait</th>
                    <th className="p-4">Completed Goals</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAgents.map((agent) => (
                    <tr
                      key={agent.id}
                      className="cursor-pointer hover:bg-sky-900 p-4"
                      onClick={() => handleRowClick(agent.id)}
                    >
                      <td className="p-2">{agent.name}</td>
                      <td className="p-2 text-center">{agent.age}</td>
                      <td className="p-2 text-center">{agent.sex}</td>
                      <td className="p-2 text-center">{agent.trait}</td>
                      <td className="p-2 text-center">
                        {agent.completedGoals.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentList;
