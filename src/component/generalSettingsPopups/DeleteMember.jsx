import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { MdClose } from "react-icons/md";
const DeleteMember = ({ onCancel, onConfirm }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`fixed inset-0 bg-opacity-50 ${
          isDarkMode ? "bg-black" : "bg-off-white"
        }`}
      />
      <div className="relative z-10 modal">
        <i
          onClick={onCancel}
          className="absolute w-24 top-4 -right-16 cursor-pointer"
        >
          <MdClose />
        </i>
        <div
          className={`rounded-xl px-5 pt-12 shadow-lg text-center w-[400px] ${
            isDarkMode ? "bg-grayBlack" : "bg-off-white"
          } max-w-md`}
        >
          <h1 className="font-bold text-[17px] bg-opacity-70">
            Are you sure you want to delete this member?
          </h1>
          <p className="py-4 text-near-white text-sm">
            Once deleted, this member will no longer be able to access the
            platform. This action cannot be undone
          </p>
          <div className="flex justify-end  gap-4 pb-4 text-xs">
            <button
              onClick={onCancel}
              className="btn-secondary border-primary text-primary"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red text-white px-3 py-2 rounded-md"
            >
              Delete Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteMember;
