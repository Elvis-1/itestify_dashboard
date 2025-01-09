import React, { useContext } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";

export const VerifyDonations = ({ setIsVerified,setIsSuccessModal }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const SaveVerification = () => {
    // if (reason !== "") {
      setIsVerified(false);
      setIsSuccessModal(true);
    // }
  };
  setTimeout(() => {
    setIsSuccessModal(false);
  }, 5000);
  return (
    <div className="fixed inset-0 z-50 ">
      {/* Non-clickable overlay */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-50`}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm shadow-2xl ">
        <div
          className={`rounded-lg p-4 modal ${
            isDarkMode ? "bg-near-black text-white" : "bg-white text-black"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full border-b border-gray-300 p-3">
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
                id="amount"
                className={`p-2 rounded-md outline-none text-sm ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
                type="number"
                placeholder="Enter amount"
              />
            </div>

            {/* Currency Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="currency">
                Currency
              </label>
              <input
                id="currency"
                className={`p-2 rounded-md outline-none text-sm uppercase ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
                placeholder="Enter currency (e.g., USD)"
                type="text"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-6 justify-end">
            <button
              onClick={() => setIsVerified(false)}
              className={`btn-secondary ${
                isDarkMode ? `` : `text-primary border-near-black `
              }`}
            >
              Cancel
            </button>
            <button onClick={SaveVerification} className="btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};
