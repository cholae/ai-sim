import { useState } from 'react';
import { CompletedGoal } from '../interfaces/Goal';

interface AgentGoalProps {
  data: CompletedGoal[];
}

const AgentGoals = ({ data }: AgentGoalProps) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({});

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleRow = (index: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [index]: !prev[index] // Toggle the current row's expanded state
    }));
  };

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mx-auto p-4">
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-lg font-semibold border-b">
              Description
            </th>
            <th className="px-4 py-2 text-lg font-semibold border-b">
              Interaction
            </th>
            <th className="px-4 py-2 text-lg font-semibold border-b">
              Completed Milestones
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <>
              {/* Main Row */}
              <tr
                key={index}
                className="cursor-pointer"
                onClick={() => toggleRow(index)}
              >
                <td className="px-4 py-2 border-b">{item.goal}</td>
                <td className="px-4 py-2 border-b">{item.interaction}</td>
                <td className="px-1 py-2 border-b text-center">
                  {item.completedMilestones.length} Milestone(s)
                  <span className="ml-4 text-red-500 underline">
                    {openRows[index] ? '▲' : '▼'}
                  </span>
                </td>
              </tr>

              {/* Collapsible Row */}
              {openRows[index] && (
                <tr className="border border-2 border-sky-500">
                  <td colSpan={1} className="px-4 py-2">
                    {item.completedMilestones.map((milestone, i) => (
                      <p key={i} className="mb-1">
                        <span className="font-bold">
                          {milestone.description}
                        </span>
                      </p>
                    ))}
                  </td>
                  <td colSpan={2} className="px-4 py-2">
                    <ul className="list-disc pl-5">
                      {item.completedMilestones.map((milestone, i) => (
                        <p key={i} className="mb-1">
                          <span>{milestone.interaction}</span>
                        </p>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </>
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
              page === currentPage ? 'underline font-semibold' : ''
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
