import React, { useContext } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";
import "../../styles/animation.css";
const ConfirmAddAdmin = ({ onCancel, onProceed}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`fixed inset-0 bg-opacity-50 ${
          isDarkMode ? "bg-black" : "bg-off-white"
        }`}
      />
      <div className="relative z-10 modal ">
        <i
          onClick={onCancel}
          className="absolute w-24 top-4 -right-16 cursor-pointer"
        >
          <MdClose />
        </i>
        <div
          className={`rounded-md px-5 py-7 shadow-lg text-center w-[350px] ${
            isDarkMode ? "bg-grayBlack" : "bg-off-white"
          } max-w-md`}
        >
          <h1 className="font-bold "></h1>
          <p
            className={`py-4 text-sm opacity-70 ${
              isDarkMode ? "text-off-white" : "text-off-black"
            }`}
          >
            If you make this user a super admin, your role will be downgraded to
            an admin. Only one super admin is allowed at a time. Do you wish to
            proceed?
          </p>
          <div className="flex justify-end text-sm  gap-4 mt-6">
            <button
              onClick={onCancel}
              className="text-primary border-primary border px-5 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onProceed}
              className="bg-primary text-white px-4 py-2 rounded-md"
            >
              Yes, Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAddAdmin;
