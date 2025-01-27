import React, { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { IoMdArrowDropdown } from "react-icons/io";
import { UsersDonations } from "../../data/donations";
import "../../styles/animation.css";

const FilterDonations = ({
  setIsFilter,
  filters,
  setFilters,
  setUserDonation,
}) => {
  const { isDarkMode } = useContext(DarkModeContext);

  // State management
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const { selectedOption, selectedCurrency, amountRange, dateRange } = filters;
  // Options data
  const currencyOptions = [
    { value: "NGN", label: "NGN (₦)", symbol: "₦" },
    { value: "USD", label: "USD ($)", symbol: "$" },
  ];

  const radioButtons = [
    { id: 1, label: "Pending", value: "Pending" },
    { id: 2, label: "Verified", value: "Verified" },
    { id: 3, label: "Failed", value: "Failed" },
  ];

  // Event handlers
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsFilter(false);
    }
  };
  const handleRadioChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      selectedOption: e.target.value,
    }));
    console.log(e.target.value);
  };

  const handleCurrencySelect = (e, value) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      selectedCurrency: value,
    }));
    setIsOpenDropdown(false);
    console.log(value);
  };

  const handleAmountChange = (e, field) => {
    setFilters((prev) => ({
      ...prev,
      amountRange: {
        ...prev.amountRange,
        [field]: e.target.value,
      },
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
    const getFilterData = UsersDonations.filter((item) => {
      const itemDate = new Date(item.date);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
        const isWithinDateRange =
          (!fromDate || itemDate >= fromDate) &&
          (!toDate || itemDate <= toDate);

        const isWithinAmount =
          (!amountRange.min ||
            parseFloat(item.amount) >= parseFloat(amountRange.min)) &&
          (!amountRange.max ||
            parseFloat(item.amount) <= parseFloat(amountRange.max));

        const currencyMatches =
          !selectedCurrency || item.currency === selectedCurrency;

        const matchesStatus = !selectedOption || item.status === selectedOption;

        return (
          isWithinDateRange &&
          isWithinAmount &&
          matchesStatus &&
          currencyMatches
        );
    });

    setUserDonation(getFilterData); // Update filtered data
    setIsFilter(false); // Close filter modal
  };

  const clearAmountRange = () => {
    setFilters((prev) => ({
      ...prev,
      amountRange: { min: "", max: "" },
    }));
  };

  const clearCurrency = () => {
    setFilters((prev) => ({
      ...prev,
      selectedCurrency: "",
    }));
  };

  const clearStatus = () => {
    setFilters((prev) => ({
      ...prev,
      selectedOption: null,
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
      selectedOption: null,
      selectedCurrency: "",
      amountRange: { min: "", max: "" },
      dateRange: { from: "", to: "" },
    });
  };

  const getInputClassName = () =>
    `${
      isDarkMode ? "bg-off-black" : "bg-off-white"
    } p-1 rounded-md outline-none text-sm placeholder:text-xs`;

  return (
    <div className="fixed inset-0 z-50 mt-24 mr-16 h-auto flex justify-end items-center">
      <div
        className={`fixed inset-0 bg-opacity-50 ${
          isDarkMode ? "bg-near-black" : "bg-white"
        }`}
        onClick={handleBackdropClick}
      />
      <div
        className={`relative z-10 ${
          isDarkMode ? "bg-black" : "bg-white"
        } shadow-2xl rounded-lg w-[380px] z-[999999] modal`}
      >
        <h3 className="text-[16px] p-3 border-b-[1px] border-b-off-white">
          Filter
        </h3>
        <form>
          {/* Amount Section */}
          <div className="p-3 border-b-[1px] border-b-off-white">
            <div className="flex justify-between items-center text-sm">
              <h4>Amount</h4>
              <h4
                className="text-primary cursor-pointer"
                onClick={() => clearAmountRange()}
              >
                Clear
              </h4>
            </div>
            <div className="flex items-center justify-between gap-6 pt-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400" htmlFor="minimum">
                  Minimum
                </label>
                <input
                  className={getInputClassName()}
                  type="number"
                  placeholder="e.g 500"
                  value={amountRange.min}
                  onChange={(e) => handleAmountChange(e, "min")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400" htmlFor="maximum">
                  Maximum
                </label>
                <input
                  className={getInputClassName()}
                  type="number"
                  placeholder="e.g 50000000"
                  value={amountRange.max}
                  onChange={(e) => handleAmountChange(e, "max")}
                />
              </div>
            </div>
          </div>

          {/* Currency Section */}
          <div className="p-3 border-b-[1px] border-b-off-white">
            <div className="flex justify-between pb-2 items-center text-sm">
              <h4>Currency</h4>
              <h4
                className="text-primary cursor-pointer"
                onClick={() => clearCurrency()}
              >
                Clear
              </h4>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpenDropdown(!isOpenDropdown);
              }}
              className={`w-full px-2 py-1 ${
                isDarkMode ? "bg-off-black" : "bg-off-white"
              } flex items-center justify-between
                p-1 rounded-md outline-none text-sm placeholder:text-xs
                hover:bg-zinc-800 transition-colors duration-200`}
            >
              <span className="text-[15px]">
                {selectedCurrency
                  ? currencyOptions.find(
                      (opt) => opt.value === selectedCurrency
                    )?.label
                  : "Select"}
              </span>
              <IoMdArrowDropdown
                className={`w-5 h-5 transition-transform duration-200 
                  ${isOpenDropdown ? "transform rotate-180" : ""}`}
              />
            </button>
            {isOpenDropdown && (
              <div
                className={`absolute w-[350px] mt-1 p-1 rounded-lg border-[1px] border-off-white outline-none text-sm placeholder:text-xs overflow-hidden ${
                  isDarkMode ? "bg-black" : "bg-off-white"
                }`}
              >
                {currencyOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={(e) => handleCurrencySelect(e, option.value)}
                    className="p-2 cursor-pointer text-white text-sm
                      hover:bg-zinc-800 transition-colors duration-150 
                      first-of-type:border-b-[1px] border-b-off-white"
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Section */}
          <div className="p-3 border-b-[1px] border-b-off-white">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h4>Status</h4>
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
                      checked={selectedOption === status.value}
                      onChange={handleRadioChange}
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
                  className={getInputClassName()}
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
                  className={getInputClassName()}
                  type="date"
                  id="to"
                  value={dateRange.to}
                  onChange={(e) => handleDateChange(e, "to")}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-end ml-auto my-12 gap-3 p-3">
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

export default FilterDonations;
