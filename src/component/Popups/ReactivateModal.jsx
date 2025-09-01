import { useState } from "react";
import PropTypes from "prop-types";
import { PiWarningCircleLight } from "react-icons/pi";
import {
  IoMdArrowDropdown,
  IoMdArrowDropup,
} from "react-icons/io";

const ReactivateModal = ({ onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [showReasonList, setShowReasonList] = useState(false);
  const [additionalReason, setAdditionalReason] = useState("");
  const [isChoosingReason, setIsChoosingReason] = useState(true);


  const reasons = [
    "User resolved previous issues",
    "Mistakenly deactivated",
    "Appealed and approved",
    "Admin override",
    "User met reactivation criteria",
    "Manual reactivation decision",
  ];
  const handleConfirm = () => {
    if (reason) {
      onSuccess();
      onClose();
      // changeSuccess();
      console.log(open);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-[#0B0B0B] rounded-xl size-[93%] shadow-lg w-[30%] flex flex-col relative p-6 justify-between">
           <button
              onClick={onClose}
              className="text-xl font-bold text-white absolute top-4 right-4 hover:text-red-500 transition-colors duration-300 flex h-10 w-[10%] justify-end"
            >
              &times;
            </button>
          <div className="flex justify-between items-center border-b pb-2 mt-5">
            <h2 className="text-[14px] font-medium text-center">
              Are you sure you want to reactivate this account? Please select a reason for reactivation to help us keep accurate records.
            </h2>
           
          </div>

          <div className="mt-4 relative">
            <label className="block text-[#A8A8A8] text-l mb-3">
              Reactivate Reason
            </label>
            <div
              onClick={() => {
                setShowReasonList((prev) => !prev);
                setIsChoosingReason(true);
              }}
              className="w-full p-2 rounded bg-[#232323] text-white cursor-pointer select-none flex items-center justify-between text-[14px] "
            >
              <span>{reason || "Select a reason"}</span>
              {showReasonList ? (
                <IoMdArrowDropup size={20} fill="white" className="text-[#A8A8A8]" />
              ) : (
                <IoMdArrowDropdown size={20} fill="white" className="text-[#A8A8A8]" />
              )}
            </div>

            {showReasonList && (
              <div className="absolute z-10 w-full max-h-[284px] overflow-y-auto bg-[#232323] rounded-[10px] text-white border border-[#444] mt-1">
                {reasons.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setReason(item);
                      setShowReasonList(false);
                    }}
                    className={`px-4 py-2 cursor-pointer border-b border-[#444] ${
                      reason === item
                        ? "bg-[#1a1a1a] text-[#A8A8A8] font-semibold"
                        : "hover:bg-[#1a1a1a]"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-[40%] mt-4">
            <label className="block text-[#A8A8A8] text-l mb-3">
              Additional Reason
            </label>
            <textarea
              value={additionalReason}
              onChange={(e) => setAdditionalReason(e.target.value)}
              maxLength={200}
              className="w-full h-[80%] rounded-[13px] bg-[#232323] text-white p-2 outline-none"
              placeholder="Type here..."
            />
            <p className="text-right mt-2 text-sm text-gray-400" >
              {additionalReason.length}/200
            </p>
          </div>

          <div className="text-[14px] p-2 mt-10 min-h-[25px] rounded shadow-inner bg-[#232323] text-white flex gap-3">
            <PiWarningCircleLight size={30} />
            <p>
              The selected reason and additional reason will be sent to the
              user&#39;s email to inform them of their account reactivation.
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-10">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#684888] rounded text-[#684888] hover:bg-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!reason}
              className={`px-4 py-2 rounded text-white transition-colors duration-300 bg-[#8B8B8B]
    ${
      reason || !isChoosingReason
        ? "bg-[#9966CC] hover:bg-red-700"
        : "bg-[#8B8B8B] hover:bg-[#8B8B8B] text-[#A8A8A8] cursor-not-allowed"
    }
  `}
            >
              Reactivate
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

ReactivateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default ReactivateModal;
