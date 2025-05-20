import React, { useState } from "react";

const usePagination = (data = []) => {
  const [currentPage, setCurrentPage] = useState(1);
  // let usersPerPage;.\
  const usersPerPage = data.length > 0 ? Math.min(3, data.length) : 3;
  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const users = data.slice(firstIndex, Math.min(lastIndex, data.length));
  const npage = Math.ceil(data.length / usersPerPage);

  return {
    currentPage,
    setCurrentPage,
    lastIndex,
    firstIndex,
    users,
    npage,
    data,
  };
};

export default usePagination;
