import React, { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";
const DeleteSuperAdmin = ({ deleteSuperAdminModal, setDeleteSuperAdminModal, setTransferConfirmModal }) => {
  const { isDarkMode } = useContext(DarkModeContext);
 
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className={`fixed inset-0 bg-opacity-50 ${
            isDarkMode ? "bg-black" : "bg-off-white"
          }`}
        />
       
        <div
          className={`relative z-10 modal max-w-sm rounded-lg shadow-lg ${
            isDarkMode ? "bg-grayBlack" : "bg-off-white"
          }`}
        >
          <i
            onClick={() => setDeleteSuperAdminModal(false)}
            className="absolute w-24 top-5 -right-16 cursor-pointer"
          >
            <MdClose />
          </i>
          <div className={` px-5 pt-10 pb-5  text-center`}>
            <h1 className="font-bold text-lg pb-4">Transfer Ownership</h1>
            <p
              className={` opacity-70 ${
                isDarkMode ? "text-off-white" : "text-off-black"
              }`}
            >
              To delete your account, you must first transfer ownership to
              another admin. Select an admin to promote to Super Admin.
            </p>
          </div>
          <div className="border-b border-b-borderColor pt-2">
            <div className="flex justify-between w-full border-t border-t-borderColor py-3 px-2">
              <p>Adeoluwa Ore</p>
              <input type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-end  gap-4 mt-10 mb-7 pr-4">
            <button
              onClick={() => setDeleteSuperAdminModal(false)}
              className={`btn-secondary px-6 py-3 text-xs text-primary border-primary ${
                isDarkMode ? `` : ` border-near-black `
              }`}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setDeleteSuperAdminModal(false);
                setTransferConfirmModal(true);
              }}
              className="btn-primary px-3 py-2 text-xs hover:text-primary"
            >
              Transfer ownership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSuperAdmin;
