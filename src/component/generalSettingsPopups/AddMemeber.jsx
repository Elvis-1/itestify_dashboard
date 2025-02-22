import React, { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { MdClose } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
const AddMemeber = ({
  setMemberModal,
  onConfirm,
  adminDetails,
  setAdminDetails,
  isEditing,
  onProceed,

}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const options = [
    { value: "Super admin", label: "Super admin" },
    { value: "Admin", label: "Admin" },
    { value: "Viewer", label: "Viewer" },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails({ ...adminDetails, [name]: value });
    console.log(adminDetails);
  };

  return (
    <div>
      {" "}
      <div className="fixed inset-0 z-50 ">
        {/* Non-clickable overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50`}
          aria-hidden="true"
        />

        {/* Modal */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm shadow-2xl ">
          <div
            className={`rounded-lg  modal ${
              isDarkMode ? "bg-near-black text-white" : "bg-white text-black"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between w-full border-b border-gray-300 p-2">
              <h1 className="text-lg">
                {isEditing ? "Edit Member" : "Verify Details"}
              </h1>
              <button
                className="cursor-pointer"
                aria-label="Close Modal"
                onClick={() => setMemberModal(false)}
              >
                <MdClose />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Admin details Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  value={adminDetails.name}
                  name="name"
                  onChange={handleChange}
                  placeholder="Enter name"
                  className={`${
                    isDarkMode ? `bg-off-black` : `bg-off-white`
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={adminDetails.email}
                  onChange={handleChange}
                  className={`${
                    isDarkMode ? `bg-off-black` : `bg-off-white`
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs`}
                />
              </div>
              {/* Dropdown  */}
              <button
                onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                className={`w-full p-2 ${
                  isDarkMode ? `bg-off-black hover:bg-zinc-800` : `bg-off-white hover:bg-near-white`
                } flex items-center justify-between
               p-1 rounded-md outline-none text-sm placeholder:text-xs
               transition-colors duration-200`}
              >
                <span className="text-sm opacity-80">
                  {adminDetails.role
                    ? options.find((opt) => opt.value === adminDetails.role)
                        ?.label
                    : "Select Role"}
                </span>
                <IoMdArrowDropdown
                  className={`w-5 h-5 transition-transform duration-200 
                ${isOpenDropdown ? "transform rotate-180" : ""}`}
                />
              </button>
              {isOpenDropdown && (
                <div
                  className={`absolute w-[350px] mt-1  rounded-lg border border-off-white outline-none text-sm placeholder:text-xs overflow-hidden  ${
                    isDarkMode ? `bg-black` : `bg-off-white`
                  }`}
                >
                  {options.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setAdminDetails((prev) => ({
                          ...prev,
                          role: option.value,
                        }));
                        setIsOpenDropdown(false);
                      }}
                      className={`p-2 cursor-pointer ${
                        isDarkMode
                          ? `text-white hover:bg-zinc-800 border-b-off-white`
                          : `text-black hover:bg-near-white border-b-borderColor`
                      } text-sm
                     transition-colors duration-150 last-of-type:border-t first-of-type:border-b`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div
              className={`flex items-center gap-3 p-4 justify-end ${
                isOpenDropdown ? `mt-32` : `mt-6`
              }`}
            >
              <button
                onClick={() => setMemberModal(false)}
                className={`btn-secondary px-6 py-3 text-xs text-primary border-primary ${
                  isDarkMode ? `` : ` border-near-black `
                }`}
              >
                Cancel
              </button>
              <button
                onClick={
                  adminDetails.role !== "Super admin" ? onProceed : onConfirm
                }
                className="btn-primary px-3 py-3 text-xs"
              >
                {isEditing ? "Save Changes" : "Add member"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemeber;
