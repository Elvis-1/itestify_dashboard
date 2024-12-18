import React from "react";

const UseSortandSearch = () => {
  const sortHeader = (header) => {
    setSort({
      keyToSort: header.key,
      direction:
        header.key === sort.keyToSort
          ? sort.direction === "ascending"
            ? "descending"
            : "ascending"
          : "descending",
    });
  };
  const sortArray = (array) => {
    if (sort.direction === "ascending") {
      return array.sort((a, b) =>
        a[sort.keyToSort] > b[sort.keyToSort] ? 1 : -1
      );
    }
    return array.sort((a, b) =>
      a[sort.keyToSort] > b[sort.keyToSort] ? -1 : 1
    );
  };
  // return (
  //   <div></div>
  // )
  return { sortHeader, sortArray };
};

export default UseSortandSearch;
