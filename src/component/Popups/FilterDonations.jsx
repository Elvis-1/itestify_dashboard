import React, { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { IoMdArrowDropdown } from "react-icons/io";

const FilterDonations = ({ setIsFilter }) => {
  const { isDarkMode } = useContext(DarkModeContext);

  // State management
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // Options data
  const currencyOptions = [
    { value: "NGN", label: "NGN (₦)", symbol: "₦" },
    { value: "USD", label: "USD ($)", symbol: "$" },
  ];

  const radioButtons = [
    { id: 1, label: "Pending", value: "pending" },
    { id: 2, label: "Verified", value: "verified" },
    { id: 3, label: "Failed", value: "failed" },
  ];

  // Event handlers
  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsFilter(false);
    }
  };

  const handleAmountChange = (e, field) => {
    setAmountRange(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleDateChange = (e, field) => {
    setDateRange(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const clearAllInput = (e) => {
    e.preventDefault();
    setSelectedCurrency("");
    setSelectedOption(null);
    setAmountRange({ min: "", max: "" });
    setDateRange({ from: "", to: "" });
  };

  const handleCurrencySelect = (e, value) => {
    e.preventDefault();
    setSelectedCurrency(value);
    setIsOpenDropdown(false);
  };

  const getInputClassName = () => `${
    isDarkMode ? 'bg-off-black' : 'bg-off-white'
  } p-1 rounded-md outline-none text-sm placeholder:text-xs`;

  return (
    <div className="fixed inset-0 z-50 mt-24 mr-16 h-auto flex justify-end items-center">
      <div
        className={`fixed inset-0 bg-opacity-50 ${
          isDarkMode ? 'bg-near-black' : 'bg-white'
        }`}
        onClick={handleBackdropClick}
      />
      <div
        className={`relative z-10 ${
          isDarkMode ? 'bg-black' : 'bg-white'
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
                onClick={() => setAmountRange({ min: "", max: "" })}
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
                  onChange={(e) => handleAmountChange(e, 'min')}
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
                  onChange={(e) => handleAmountChange(e, 'max')}
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
                onClick={() => setSelectedCurrency("")}
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
                isDarkMode ? 'bg-off-black' : 'bg-off-white'
              } flex items-center justify-between
                p-1 rounded-md outline-none text-sm placeholder:text-xs
                hover:bg-zinc-800 transition-colors duration-200`}
            >
              <span className="text-[15px]">
                {selectedCurrency
                  ? currencyOptions.find((opt) => opt.value === selectedCurrency)?.label
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
                  isDarkMode ? 'bg-black' : 'bg-off-white'
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
                  onClick={() => setSelectedOption(null)}
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
                onClick={() => setDateRange({ from: "", to: "" })}
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
                  onChange={(e) => handleDateChange(e, 'from')}
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
                  onChange={(e) => handleDateChange(e, 'to')}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-end ml-auto my-12 gap-3 p-3">
            <button
              className={`btn-secondary ${
                isDarkMode ? '' : 'text-primary border-near-black'
              }`}
              onClick={clearAllInput}
            >
              Clear all
            </button>
            <button
              className={`btn-primary ${
                isDarkMode ? '' : 'hover:text-off-black'
              }`}
              onClick={(e) => {
                e.preventDefault();
                // Add your filter submission logic here
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