import { useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd"; // Ant Design Modal
import { PiWarningCircleLight } from "react-icons/pi";
import { IoMdArrowDropdown } from "react-icons/io";
import { GiCheckMark } from "react-icons/gi";
import Swal from "sweetalert2"; // SweetAlert2

const ReactivateModal = ({ onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [showReasonList, setShowReasonList] = useState(false);
  const [additionalReason, setAdditionalReason] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
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
     
      Swal.fire({
        title: "Confirm Reactivation?",
        text: "Are you sure you want to reactivate this account with the selected reason?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#9966CC",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Reactivate!",
        background: "#121212",
        color: "#ffffff",
        customClass: {
          popup: " p-6",
          confirmButton: "px-6 py-2 rounded text-sm",
          cancelButton: "px-6 py-2 rounded text-sm",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          
          setShowSuccessModal(true);
          
        }
      });
    }
  };

  const handleSuccessOk = () => {
   
    setShowSuccessModal(false); 


    onSuccess();


    onClose();
  };

  return (
    <>
   
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-[#0B0B0B] rounded-xl shadow-lg w-[30%] flex gap-2 flex-col relative size-[80%] p-6 justify-between">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">
              Are you sure you want to reactivate this account?
            </h2>
            <button
              onClick={onClose}
              className="text-xl font-bold text-gray-600"
            >
              &times;
            </button>
          </div>

          <div className="mt-4 relative">
            <label className="block text-[#A8A8A8] text-l mb-3">
              Reactivate Reason
            </label>
            <div
              onClick={() => setShowReasonList((prev) => !prev)}
              className="w-full p-2 rounded bg-[#232323] text-white cursor-pointer select-none flex items-center justify-between"
            >
              <span>{reason || "Select a reason"}</span>
              <IoMdArrowDropdown size={20} className="text-[#A8A8A8]" />
            </div>

            {showReasonList && (
              <div
                className="absolute z-10 w-full max-h-[284px] overflow-y-auto bg-[#232323] rounded-[10px] text-white border border-[#444] mt-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
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
              className="w-full h-[90%] rounded-[13px] bg-[#232323] text-white p-2 outline-none"
              placeholder="Type here..."
            />
            <p className="text-right mt-2 text-sm text-gray-400">
              {additionalReason.length}/200
            </p>
          </div>

          <div className="text-[14px] p-4 mt-10 min-h-[30px] rounded shadow-inner bg-[#232323] text-white outline-none flex gap-3 justify-start items-start">
            <PiWarningCircleLight size={30} />
            <p className="w-[77%]">
              The selected reason as well as the additional reason will be sent
              to the user&apos;s email to inform them of their account
              reactivation.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#684888] rounded hover:bg-gray-400 text-[#A8A8A8] hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!reason}
              className="px-4 py-2 bg-[#8B8B8B] text-white rounded hover:bg-green-600 disabled:opacity-50 hover:text-white disabled:hover:bg-[#8B8B8B] disabled:hover:text-[#A8A8A8] disabled:cursor-not-allowed"
            >
              Reactivate
            </button>
          </div>
        </div>
      </div>

    
      <Modal
        open={showSuccessModal}
        onOk={handleSuccessOk}
        onCancel={handleSuccessOk} 
        centered
        closable={false}
        footer={null}
        className="ant-modal-no-header"
        width={400}
        bodyStyle={{
          backgroundColor: '#0B0B0B',
          borderRadius: '12px',
          padding: '24px',
          color: 'white',
        }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div className="text-center py-6">
          <div
            style={{
              fontSize: "50px",
              color: "#ffff",
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              backgroundColor: "#9966CC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 15px",
            }}
          >
            <GiCheckMark />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Account Reactivated Successfully!
          </h2>
          <p className="text-[#A8A8A8]">The user has been notified via email.</p>
          <button
            onClick={handleSuccessOk}
            className="mt-6 px-6 py-2 bg-[#9966CC] text-white rounded hover:bg-[#8040B0]"
          >
            Done
          </button>
        </div>
      </Modal>
    </>
  );
};

ReactivateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default ReactivateModal;

