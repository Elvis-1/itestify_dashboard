import { useState } from "react";

const useSort = () => {
  const [sort, setSort] = useState({
    keyToSort: "serialno",
    direction: "descending"
  });
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

  return { sortHeader, sortArray, sort,setSort};
};

export default useSort;
