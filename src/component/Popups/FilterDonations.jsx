import React, { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
const FilterDonations = ({ setIsFilter }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const radioButtons = [
    { id: 1, label: "Pending", value: "pending" },
    { id: 2, label: "Verified", value: "verified" },
    { id: 3, label: "Failed", value: "failed" },
  ];

  const handleSelectChange = (e) => {
    setSelectedCurrency(e.target.value);
  };

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsFilter(false);
    }
  };
  const clearAllInput = (e) => {
    setSelectedCurrency(null);
    setSelectedOption(null);
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 mt-24 mr-16 h-auto flex justify-end items-center">
      <div
        className={`fixed inset-0 bg-opacity-50 ${
          isDarkMode ? `bg-near-black` : `bg-white `
        }`}
        onClick={handleBackdropClick}
      />
      <div
        className={`relative z-10 ${
          isDarkMode ? ` bg-black` : `bg-white`
        } shadow-2xl rounded-lg w-[380px] z-[999999]`}
      >
        <h3 className="text-[16px] p-3 border-b-[1px] border-b-off-white">
          Filter
        </h3>
        <form>
          <div className="p-3 border-b-[1px] border-b-off-white">
            <div className="flex justify-between items-center text-sm">
              <h4>Amount</h4>
              <h4 className="text-primary cursor-pointer">Clear</h4>
            </div>
            <div className="flex items-center justify-between gap-6 pt-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400" htmlFor="minimum">
                  Minimum
                </label>
                <input
                  className={`${
                    isDarkMode ? `bg-off-black` : `bg-off-white`
                  } p-1 rounded-md outline-none text-sm placeholder:text-xs`}
                  type="number"
                  placeholder="e.g 500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400" htmlFor="maximum">
                  Maximum
                </label>
                <input
                  className={`${
                    isDarkMode ? `bg-off-black` : `bg-off-white`
                  } p-1 rounded-md outline-none text-sm placeholder:text-xs`}
                  type="number"
                  placeholder="e.g 50000000"
                />
              </div>
            </div>
          </div>
          <div className="p-3 border-b-[1px] border-b-off-white">
            <div className="flex justify-between items-center text-sm">
              <h4>Currency</h4>
              <h4 className="text-primary cursor-pointer">Clear</h4>
            </div>
            <div className="flex items-center justify-between gap-6 pt-2">
              <div className="flex flex-col gap-2 w-full">
                <div className="relative w-full">
                  <select
                    className={`appearance-none ${
                      isDarkMode ? `bg-off-black` : `bg-off-white`
                    } p-1 rounded-md outline-none text-sm w-full cursor-pointer`}
                    name="currency"
                    id="currency"
                    value={selectedCurrency}
                    onChange={handleSelectChange}
                  >
                    <option className="text-sm p-1" value="select">
                      Select
                    </option>
                    <option value="NGN">NGN(₦)</option>
                    <option value="USD">USD($)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 border-b-[1px] border-b-off-white">
            <div className="flex flex-col gap-2">
              <h4>Status</h4>
              <div className="flex items-center gap-4">
                {radioButtons.map((status) => (
                  <label className="flex items-center text-sm">
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
          <div className="p-3 border-b-[1px] border-b-off-white">
            <div className="flex justify-between items-center text-sm">
              <h4>Date Range</h4>
              <h4 className="text-primary cursor-pointer">Clear</h4>
            </div>
            <div className="flex justify-between gap-6 pt-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400" htmlFor="from">
                  From
                </label>
                <input
                  className={`${
                    isDarkMode ? `bg-off-black` : `bg-off-white`
                  } p-1 rounded-md outline-none text-sm placeholder:text-xs`}
                  type="date"
                  id="from"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400" htmlFor="to">
                  To
                </label>
                <input
                  className={`${
                    isDarkMode ? `bg-off-black` : `bg-off-white`
                  } p-1 rounded-md outline-none text-sm placeholder:text-xs`}
                  type="date"
                  id="to"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end items-end ml-auto my-12 gap-3 p-3">
            <button
              className={`btn-secondary ${
                isDarkMode ? `` : `text-primary border-near-black `
              }`}
              onClick={clearAllInput}
            >
              Clear all
            </button>
            <button
              className={`btn-primary ${
                isDarkMode ? `` : `hover:text-off-black`
              }`}
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
