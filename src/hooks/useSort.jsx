import { useState, useMemo } from "react";

const useSort = (data = []) => {
  const [sort, setSort] = useState({
    keyToSort: "serialno",
    direction: "descending",
  });

  const sortHeader = (header) => {
    setSort((prevSort) => ({
      keyToSort: header.key,
      direction:
        header.key === prevSort.keyToSort
          ? prevSort.direction === "ascending"
            ? "descending"
            : "ascending"
          : "descending",
    }));
  };

  const sortedData = useMemo(() => {
    if (!sort.keyToSort || data.length === 0) return data;

    return [...data].sort((a, b) => {
      let valueA = a[sort.keyToSort];
      let valueB = b[sort.keyToSort];

      // Handle potential null or undefined values
      if (valueA == null) valueA = "";
      if (valueB == null) valueB = "";

      // Convert values to lowercase if sorting strings (to make case-insensitive)
      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return sort.direction === "ascending" ? -1 : 1;
      if (valueA > valueB) return sort.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [data, sort]);

  return { sortHeader, sort, sortedData, setSort };
};

export default useSort;
