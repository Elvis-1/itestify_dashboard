import React, { useState, useContext } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";
import { IoMdArrowDropdown } from "react-icons/io";

export const VerifyDonations = ({ setIsVerified, setIsSuccessModal }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [selected, setSelected] = useState("");

  const options = [
    { value: "NGN", label: "NGN (₦)", symbol: "₦" },
    { value: "USD", label: "USD ($)", symbol: "$" },
  ];
  const SaveVerification = () => {
    // if (reason !== "") {
    setIsVerified(false);
    setIsSuccessModal(true);
    // }
  };
  setTimeout(() => {
    setIsSuccessModal(false);
  }, 2000);
  return (
    <div className="fixed inset-0 z-50 ">
      {/* Non-clickable overlay */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-50`}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm shadow-2xl">
        <div
          className={`rounded-lg  modal ${
            isDarkMode ? "bg-near-black text-white" : "bg-white text-black"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full border-b border-gray-300 p-2">
            <h1 className="text-lg">Verify Details</h1>
            <button
              className="cursor-pointer"
              aria-label="Close Modal"
              onClick={() => setIsVerified(false)}
            >
              <MdClose />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Amount Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="amount">
                Amount
              </label>
              <input
                type="number"
                className={`${
                  isDarkMode ? `bg-off-black` : `bg-off-white`
                } p-1 rounded-md outline-none text-sm placeholder:text-xs`}
              />
            </div>
            {/* Dropdown  */}
            <button
              onClick={() => setIsOpenDropdown(!isOpenDropdown)}
              className={`w-full px-2 py-1 ${
                isDarkMode ? `bg-off-black` : `bg-off-white`
              } flex items-center justify-between
           p-1 rounded-md outline-none text-sm placeholder:text-xs
          hover:bg-zinc-800 transition-colors duration-200`}
            >
              <span className="text-[15px]">
                {selected
                  ? options.find((opt) => opt.value === selected)?.label
                  : "Select"}
              </span>
              <IoMdArrowDropdown
                className={`w-5 h-5 transition-transform duration-200 
            ${isOpenDropdown ? "transform rotate-180" : ""}`}
              />
            </button>
            {isOpenDropdown && (
              <div
                className={`absolute w-[350px] mt-1 p-1 rounded-lg border-[1px] border-off-white outline-none text-sm placeholder:text-xs overflow-hidden  ${
                  isDarkMode ? `bg-black` : `bg-off-white`
                }`}
              >
                {options.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSelected(option.value);
                      setIsOpenDropdown(false);
                    }}
                    className="p-2 cursor-pointer text-white text-sm
                hover:bg-zinc-800 transition-colors duration-150  first-of-type:border-b-[1px] border-b-off-white"
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className={`flex items-center gap-3 p-4 justify-end ${isOpenDropdown? `mt-32`: `mt-6`}`}>
            <button
              onClick={() => setIsVerified(false)}
              className={`btn-secondary ${
                isDarkMode ? `` : `text-primary border-near-black `
              }`}
            >
              Cancel
            </button>
            <button onClick={SaveVerification} className="btn-primary">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
