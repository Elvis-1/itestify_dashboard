import React, { useContext } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";
import "../../styles/animation.css";
import { ScriptureContext } from "../../context/ScriptureContext";
const DeleteScripture = ({ setDeleteModal, onDelete, scriptureId }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { scriptureUploadedDetails } = useContext(ScriptureContext);
  const scriptureToDelete = scriptureUploadedDetails.find(
    (item) => item.id === scriptureId
  );
  const scriptureStatus = scriptureToDelete.status 
  const getDeleteMessage = () => {
    switch (scriptureStatus) {
      case "uploaded":
        return "Are you sure you want to delete this uploaded scripture? Once deleted, this action cannot be undone.";
      case "scheduled":
        return "Are you sure you want to delete this scheduled scripture? This action will remove the scripture permanently, and it will not be uploaded on the scheduled date and time.";
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`fixed inset-0 bg-opacity-50 ${
          isDarkMode ? "bg-black" : "bg-off-white"
        }`}
      />
      <div className="relative z-10 modal ">
        <i
          onClick={() => setDeleteModal(false)}
          className="absolute w-24 top-4 -right-16 cursor-pointer"
        >
          <MdClose />
        </i>
        <div
          className={`rounded-md px-5 py-6 shadow-lg text-center w-[450px] ${
            isDarkMode ? "bg-grayBlack" : "bg-off-white"
          } max-w-md`}
        >
          <h1 className="font-bold text-lg">Delete Scripture</h1>
          <p className="py-4">{getDeleteMessage()}</p>
          <div className="flex justify-end  gap-4">
            <button
              onClick={() => setDeleteModal(false)}
              className="text-primary border border-primary px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(scriptureId)}
              className="bg-red text-white px-4 py-2 rounded-md"
            >
              Yes, delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteScripture;
