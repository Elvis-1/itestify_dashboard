import React, { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";
import "../../styles/animation.css";

const FailedStatus = ({
  setISFailedModal,
  setIsSuccessModal,
  reason,
  setReason,
  markAsFailed,
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
      setISFailedModal(false);
      setIsSuccessModal(true);
      setReason("");
    } catch (error) {
      setError("Failed to update donation status. Please try again.");
      console.error("Error in handleConfirmFailed:", error);
    }
  };
  return (
    <div>
      {" "}
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50"
        onClick={() => setISFailedModal(false)}
      ></div>
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center modal mt-8">
        <div
          className={`rounded-lg shadow-lg w-full max-w-sm relative z-10 modal p-4 ${
            isDarkMode
              ? "dark-mode bg-black text-white"
              : "bg-off-white text-black light-mode"
          }`}
        >
          <div className="mb-4">
            <i
              className="absolute w-24 top-4 -right-16 cursor-pointer"
              onClick={() => {
                setISFailedModal(false);
              }}
            >
              <MdClose />
            </i>
          </div>
          <div className="text-center ">
            <h2 className="font-bold py-3">
              Are you sure you want to change Status to failed?
            </h2>
            <p className="text-xs text-near-white">
              This donation is currently marked as Verified. Are you sure you
              want to mark it as Failed? This action will remove the
              verification status and the customer will be notified of this
              update with reason of failure.
            </p>
          </div>
          <form action="">
            <div>
              <p
                className={`text-xs ${
                  isDarkMode ? `text-off-white` : `text-off-black`
                } font-normal pb-4 pt-6`}
              >
                Reason why donation is marked as failed
              </p>
              <textarea
                name="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                id="reason"
                placeholder="Type here..."
                className={`resize-none p-2 rounded-lg outline-none text-sm h-[200px] w-full ${
                  isDarkMode ? "bg-[#313131]" : "bg-white "
                }`}
              ></textarea>
              {error && (
                <span className="text-red-500 text-sm mt-1">{error}</span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-10 justify-end ">
              <button
                onClick={() => {
                  setISFailedModal(false);
                }}
                className={`btn-secondary text-primary border-primary ${
                  isDarkMode ? `` : ``
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleConfirmFailed}
                className="btn-primary bg-red px-4 border-[1px] border-transparent hover:border-white hover:text-red"
              >
                Mark as failed
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FailedStatus;
