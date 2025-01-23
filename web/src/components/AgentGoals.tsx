import React, { useState } from "react";
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
      <table className="table-auto w-full border-collapse border border-gray-900">
        <thead className="bg-gray-800">
          <tr>
            <th className="border border-gray-900 px-4 py-2">Description</th>
            <th className="border border-gray-900 px-4 py-2">Interaction</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index} className="even:bg-gray-800">
              <td className="border border-gray-900 px-4 py-2">
                {item.goal}
              </td>
              <td className="border border-gray-900 px-4 py-2">
                {item.interaction}
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
          className="px-3 py-1 hover:bg-sky-800 disabled:bg-gray-90 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 border border-gray-300 ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 hover:bg-sky-800 disabled:bg-gray-90 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AgentGoals;
