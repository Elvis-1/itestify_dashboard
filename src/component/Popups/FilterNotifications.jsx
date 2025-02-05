import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const FilterNotifications = ({
  setIsFilter,
  filters,
  setFilters,
  notifications,
  setNotifications,
}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { dateRange, selectedStatusOption, selectedTypeOption } = filters;
  const TypeRadioButtons = [
    { id: 1, label: "Testimony", value: "Testimony" },
    { id: 2, label: "Donation", value: "Donation" },
  ];
  const StatusRadioButton = [
    { id: 1, label: "Read", value: "read" },
    { id: 2, label: "Unread", value: "unread" },
  ];
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsFilter(false);
    }
  };
  const handleStatusRadioChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      selectedStatusOption: e.target.value,
    }));
    console.log(e.target.value);
  };
  const handleTypeRadioChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      selectedTypeOption: e.target.value,
    }));
    console.log(e.target.value);
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

  const handleFiltering = () => {
    const getFilterData = notifications.filter((item) => {
      const itemDate = new Date(item.date);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
      const isWithinDateRange =
        (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);

      const matchesStatus =
        !selectedStatusOption || item.status === selectedStatusOption;
      const matchesType =
        !selectedTypeOption || item.type === selectedTypeOption;

      return isWithinDateRange && matchesStatus && matchesType;
    });

    setNotifications(getFilterData); // Update filtered data
    setIsFilter(false); // Close filter modal
  };
  const clearStatus = () => {
    setFilters((prev) => ({
      ...prev,
      selectedStatusOption: null,
    }));
  };
  const clearType = () => {
    setFilters((prev) => ({
      ...prev,
      selectedTypeOption: null,
    }));
  };

  const clearDateRange = () => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { from: "", to: "" },
    }));
  };

  const clearAllInput = (e) => {
    e.preventDefault();
    setFilters({
      selectedStatusOption: null,
      selectedTypeOption: null,
      dateRange: { from: "", to: "" },
    });
  };

  return (
    <div className="fixed inset-0 z-50 mt-32 mr-16 h-auto flex justify-end items-center">
      <div
        className={`fixed inset-0 bg-opacity-50 ${
          isDarkMode ? "bg-near-black" : "bg-white"
        }`}
        onClick={handleBackdropClick}
      />
      <div
        className={`relative z-10 ${
          isDarkMode ? "bg-black" : "bg-white"
        } shadow-2xl rounded-lg w-[320px] z-[999999] modal`}
      >
        <h3 className="text-[16px] p-3 border-b-[1px] border-b-off-white">
          Filter
        </h3>
        <form>
          {/* Type Section */}
          <div className="p-3 border-b-[1px] border-b-off-white">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm">
                <h4>Type</h4>
                <p
                  className="text-primary cursor-pointer "
                  onClick={() => clearType()}
                >
                  Clear
                </p>
              </div>
              <div className="flex items-center gap-4">
                {TypeRadioButtons.map((type) => (
                  <label key={type.id} className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={selectedTypeOption === type.value}
                      onChange={handleTypeRadioChange}
                      className="form-radio text-purple-600 accent-primary cursor-pointer w-4 h-4 border-2 border-primary rounded-full bg-black"
                    />
                    <span className="ml-2">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Status Section */}
          <div className="p-3 border-b-[1px] border-b-off-white">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm">
                <h4>Status</h4>
                <p
                  className="text-primary cursor-pointer"
                  onClick={() => clearStatus()}
                >
                  Clear
                </p>
              </div>
              <div className="flex items-center gap-4">
                {StatusRadioButton.map((status) => (
                  <label key={status.id} className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={selectedStatusOption === status.value}
                      onChange={handleStatusRadioChange}
                      className="form-radio text-purple-600 accent-primary cursor-pointer w-4 h-4 border-2 border-primary rounded-full bg-black"
                    />
                    <span className="ml-2">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Date Range Section */}
          <div className="p-3 border-b-[1px] border-b-off-white">
            <div className="flex justify-between items-center text-sm">
              <h4>Date Range</h4>
              <p
                className="text-primary cursor-pointer"
                onClick={() => clearDateRange()}
              >
                Clear
              </p>
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
                  value={dateRange.from}
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
                  value={dateRange.to}
                  onChange={(e) => handleDateChange(e, "to")}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-end ml-auto my-4 gap-3 p-3">
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
              onClick={(e) => {
                e.preventDefault();
                handleFiltering();
              }}
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterNotifications;
