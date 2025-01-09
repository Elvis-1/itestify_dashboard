import React from "react";
import usePagination from "../context/usePagination";

const Pagination = ({
  setCurrentPage,
  firstIndex,
  lastIndex,
  currentPage,
  npage,
  data,
}) => {
  return (
    <div className="flex justify-between absolute bottom-0 left-0 w-full mt-24 mb-12">
      <div className="flex justify-between items-center w-full px-4">
        {data.length === 0 ? (
          <p>Showing 0 of 0</p>
        ) : (
          <p>
            Showing {firstIndex + 1} - {lastIndex} of {data.length}
          </p>
        )}
        <div className="flex gap-2 items-center">
          <button
            className="btn-primary border-gray-300 bg-transparent text-gray-300"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="btn-secondary border-primary rounded-md text-primary"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === npage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
