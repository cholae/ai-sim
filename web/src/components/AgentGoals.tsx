import { useState } from "react";
import { CompletedGoal } from "../interfaces/Goal";

interface AgentGoalProps {
    data: CompletedGoal[];
  }

const AgentGoals = ({ data }: AgentGoalProps) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Completed Goals</h1>
      <table className="table-auto w-full text-left">
        <thead>
          <tr>
            <th className="px-4 py-2 text-lg font-semibold">Description</th>
            <th className="px-4 py-2 text-lg font-semibold">Interaction</th>
            <th className="px-4 py-2 text-lg font-semibold">Completed Milestones</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{item.goal}</td>
              <td className="px-4 py-2">{item.interaction}</td>
              <td className="px-4 py-2">
                <ul className="list-disc pl-5">
                  {item.completedMilestones.map((milestone, i) => (
                    <li key={i} className="mb-1">
                      <span className="font-bold">{milestone.description}</span> -{" "}
                      {milestone.interaction}{" "}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 ${
              page === currentPage ? "underline font-semibold" : ""
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
  
};

export default AgentGoals;
