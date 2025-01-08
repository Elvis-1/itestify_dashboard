import React, { useContext } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";

const DeleteRecordsModal = ({
  selectAll,
  selectedUsers,
  onCancel,
  onConfirm,
}) => {
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
          className={`rounded-md px-5 py-7 shadow-lg text-center w-[450px] ${
            isDarkMode ? "dark-mode" : "light-mode"
          } max-w-md`}
        >
          <h1 className="font-bold text-lg">
            Delete
            {selectAll  || (selectedUsers && selectedUsers.length > 1)
              ? `All Records`
              : `Record`}
            ?
          </h1>
          <p className="py-4">
            {selectAll || (selectedUsers && selectedUsers.length > 1)
              ? `Are you sure you want to delete all records? This action cannot be undone, and all information about these deleted accounts will be permanently removed from the system.`
              : `Are you sure you want to delete this record? This action cannot be undone, and all information about this deleted account will be permanently removed from the system.`}
          </p>
          <div className="flex justify-end  gap-4">
            <button
              onClick={onCancel}
              className="bg-gray-300 text-black px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red text-white px-4 py-2 rounded-md"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteRecordsModal;
