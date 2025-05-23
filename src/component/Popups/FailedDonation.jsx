import React, { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";
import "../../styles/animation.css";

const FailedDonation = ({
  setIsFailed,
  setIsSuccessModal,
  markAsFailed,
  reason,
  setReason,
}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [error, setError] = useState("");

  const handleConfirmFailed = (e) => {
    e.preventDefault();
    // Validate reason
    if (!reason.trim()) {
      setError("Please provide a reason for marking the donation as failed");
      return;
    }
    try {
      setError("");
      markAsFailed(reason);
      setIsFailed(false);
      setIsSuccessModal(true);
      setReason("");
    } catch (error) {
      setError("Failed to update donation status. Please try again.");
      console.error("Error in handleConfirmFailed:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm shadow-2xl">
        <div
          className={`rounded-lg p-4 modal ${
            isDarkMode ? "bg-near-black text-white" : "bg-white text-black"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full border-b border-gray-300 p-3">
            <h1 className="text-lg font-medium">Failed Donation</h1>
            <button
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Close Modal"
              onClick={() => setIsFailed(false)}
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="reason">
                Reason why donation is marked as failed
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                className={`p-2 rounded-lg outline-none text-sm h-[300px] resize-none
                  focus:ring-2 focus:ring-primary transition-colors duration-200
                  ${isDarkMode ? "bg-[#313131]" : "bg-off-white"}
                  ${error ? "border-red-500 ring-red-200" : ""}
                `}
                placeholder="Please provide a detailed reason..."
              />
              {error && (
                <span className="text-red-500 text-sm mt-1">{error}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6 justify-end">
            <button
              onClick={() => setIsFailed(false)}
              className={`btn-secondary transition-colors duration-200 ${
                isDarkMode ? "" : "text-primary border-near-black"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmFailed}
              disabled={!reason.trim()}
              className={`btn-primary transition-colors duration-200 
                ${!reason.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailedDonation;
