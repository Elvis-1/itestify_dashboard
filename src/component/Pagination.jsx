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
    <div className="flex justify-between items-center w-full pt-24 pb-12 px-4">
      {data.length === 0 ? (
        <p>Showing 0 of 0</p>
      ) : (
        <p>
          Showing {firstIndex + 1} - {lastIndex} of {data.length}
        </p>
      )}
      <div className="flex gap-2 items-center">
        <button
          className="px-4 py-2 border-2 border-[#575757] rounded-md hover:border-[#9966CC]"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 border-2 border-[#9966CC] rounded-md text-[#9966CC]"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === npage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;