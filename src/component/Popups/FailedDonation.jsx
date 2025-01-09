import React, { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";

const FailedDonation = ({ setIsFailed, setIsSuccessModal }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [reason, setReason] = useState("");
  const confirmFailed = () => {
    if (reason !== "") {
      setIsFailed(false);
      setIsSuccessModal(true);
    }
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
            <h1 className="text-lg">Failed Donation</h1>
            <button
              className="cursor-pointer"
              aria-label="Close Modal"
              onClick={() => setIsFailed(false)}
            >
              <MdClose />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="amount">
                Reason why donation is marked as failed
              </label>
              <textarea
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                id="amount"
                value={reason}
                className={`p-2 rounded-lg outline-none text-sm h-[300px] ${
                  isDarkMode ? "bg-[#313131]" : "bg-off-white"
                }`}
                type="number"
                placeholder="Type here..."
              ></textarea>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-6 justify-end">
            <button
              onClick={() => setIsFailed(false)}
              className={`btn-secondary ${
                isDarkMode ? `` : `text-primary border-near-black `
              }`}
            >
              Cancel
            </button>
            <button onClick={confirmFailed} className="btn-primary">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailedDonation;
