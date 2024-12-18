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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-opacity-50${
        isDarkMode ? `bg-black` : `bg-off-white`
      } `}
    >
      <div className="relative">
        <i
          onClick={onCancel}
          className="absolute w-24 top-4 -right-16 cursor-pointer"
        >
          <MdClose />
        </i>
        <div className={`rounded-md px-5 py-7 shadow-lg text-center w-[450px] ${isDarkMode? `dark-mode`: `light-mode`} max-w-md`}>
          <h1 className="font-bold text-lg">
            Delete
            {selectAll || (selectedUsers && selectedUsers.length > 1)
              ? `All Records`
              : `Record`}
            ?
          </h1>
          <p className="py-4">
            {selectAll || (selectedUsers && selectedUsers.length > 1)
              ? `Are you sure you want to delete all record? This action cannot be undone, and all information about this deleted accounts will be permanently removed from the system.`
              : `Are you sure you want to delete this record? This action cannot be undone, and all information about this deleted account will be permanently removed from the system.`}
          </p>
          <div className="flex items-center gap-2  justify-end text-sm">
            <button
              onClick={onCancel}
              className="py-3 px-7 border-2 border-[#9966CC] text-[#9966CC] rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="py-3 px-4 text-white rounded-md bg-[#E53935] "
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeleteRecordsModal;
