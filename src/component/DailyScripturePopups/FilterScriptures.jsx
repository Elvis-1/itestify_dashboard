import React, { useContext,useEffect} from "react";
import "../../styles/animation.css";
import { DarkModeContext } from "../../context/DarkModeContext";

const FilterScriptures = ({
  setIsFilter,
  setScriptures,
  allScriptures,
  filters,
  setFilters,
//   onFilterChange
}) => {
  const { isDarkMode } = useContext(DarkModeContext);    
  const radioButtons = [
    { id: 1, label: "Uploaded", value: "uploaded" },
    { id: 2, label: "Scheduled", value: "scheduled" },
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsFilter(false);
    }
  };
  const handleFiltering = (e) => {
    e.preventDefault();
    const getFilterData = allScriptures.filter((item) => {
      const itemDate = new Date(item.selectedDate);
      if (isNaN(itemDate.getTime())) return false;
      const fromDate = filters.dateRange.from
        ? new Date(filters.dateRange.from)
        : null;
      const toDate = filters.dateRange.to
        ? new Date(filters.dateRange.to)
        : null;
      const isWithinDateRange =
        (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);
      return isWithinDateRange;
    });

    setScriptures(getFilterData);
    setIsFilter(false);
    // onFilterChange(getFilterData)
    console.log(allScriptures);
  };
  const handleDateChange = (e, field) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: e.target.value,
      },
    }));
    console.log(e.target.value);
  };
  const handleRadioChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      selectedOption: e.target.value,
    }));
    console.log(e.target.value);
  };

  const clearDateRange = () => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { from: "", to: "" },
    }));
    setScriptures(allScriptures);
    // onFilterChange(allScriptures);
  };
  const clearStatus = () => {
    setFilters((prev) => ({
      ...prev,
      selectedOption: null,
    }));
    setScriptures(allScriptures);
    // onFilterChange(allScriptures);
  };

  const clearAllInput = (e) => {
    e.preventDefault();
    setFilters({
      selectedOption: null,
      dateRange: { from: "", to: "" },
    });
    setScriptures(allScriptures);
    // onFilterChange(allScriptures);
  };

  return (
    <div className="fixed inset-0 z-50 mt-56  mr-16 h-auto flex justify-end items-center">
      <div
        className={`fixed inset-0 bg-opacity-50 ${
          isDarkMode ? "bg-near-black" : "bg-white"
        }`}
        onClick={handleBackdropClick}
      />
      <div
        className={`relative z-10 ${
          isDarkMode ? "bg-black" : "bg-white"
        } shadow-2xl rounded-lg w-[380px] modal`}
      >
        <h3 className="text-[16px] p-3 border-b-[1px] border-b-off-white">
          Filter
        </h3>
        <form action="" onSubmit={handleFiltering}>
          {/* Date Range Section */}
          <div className="p-3 border-b-[1px] border-b-off-white">
            <div className="flex justify-between items-center text-sm">
              <h4>Date Range</h4>
              <h4
                className="text-primary cursor-pointer"
                onClick={() => clearDateRange()}
              >
                Clear
              </h4>
            </div>
            <div className="flex justify-between gap-6 pt-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400" htmlFor="from">
                  From
                </label>
                <input
                  className={`${
                    isDarkMode ? "bg-off-black" : "bg-off-white"
                  } p-1 rounded-md outline-none text-sm placeholder:text-xs`}
                  type="date"
                  id="from"
                  value={filters.dateRange.from}
                  onChange={(e) => handleDateChange(e, "from")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400" htmlFor="to">
                  To
                </label>
                <input
                  className={`${
                    isDarkMode ? "bg-off-black" : "bg-off-white"
                  } p-1 rounded-md outline-none text-sm placeholder:text-xs`}
                  type="date"
                  id="to"
                  value={filters.dateRange.to}
                  onChange={(e) => handleDateChange(e, "to")}
                />
              </div>
            </div>
          </div>

          {/* Scripture Status  */}
          <div className="p-3">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h4>Scripture Status</h4>
                <h4
                  className="text-primary cursor-pointer"
                  onClick={() => clearStatus()}
                >
                  Clear
                </h4>
              </div>
              <div className="flex items-center gap-4">
                {radioButtons.map((status) => (
                  <label key={status.id} className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={filters.selectedOption === status.value}
                      onChange={handleRadioChange}
                      className="form-radio text-purple-600 accent-primary cursor-pointer w-4 h-4 border-2 border-primary rounded-full bg-black"
                    />
                    <span className="ml-2">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-end ml-auto my-6 gap-3 p-3">
            <button
              className={`btn-secondary ${
                isDarkMode ? "" : "text-primary border-near-black"
              }`}
              onClick={clearAllInput}
            >
              Clear all
            </button>
            <button
              className={`btn-primary ${
                isDarkMode ? "" : "hover:text-off-black"
              }`}
              type="submit"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterScriptures;
