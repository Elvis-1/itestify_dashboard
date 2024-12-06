import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { MdClose } from "react-icons/md";

const DeleteModal = () => {
  const { selectAll, setDeleteModal } = useContext(UserContext);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-black">
      <div className="relative">
        <i
          onClick={() => {
            setDeleteModal(false);
          }}
          className="absolute w-24 top-4 -right-16 cursor-pointer"
        >
          <MdClose />
        </i>
        <div className="rounded-md px-5 py-7 shadow-lg text-center w-[450px]  bg-black  max-w-md">
          <h1 className="font-bold text-lg">
            Delete {selectAll ? `Selected Guest users` : `Guest user`}?
          </h1>
          <p className="py-4">
            {selectAll
              ? `Are you sure you want to delete the selected guest users? This action cannot be undone, and all selected guest users’ session data will be permanently removed`
              : `Are you sure you want to delete this guest user?.This action cannot
            be undone, and the guest user’s session data will be permanently
            removed.`}
          </p>
          <div className="flex items-center gap-2  justify-end text-sm">
            <button
              onClick={() => {
                setDeleteModal(false);
              }}
              className="py-3 px-7 border-2 border-[#9966CC] text-[#9966CC] rounded-md"
            >
              Cancel
            </button>
            <button className="py-3 px-4  rounded-md bg-[#E53935] ">
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeleteModal;
