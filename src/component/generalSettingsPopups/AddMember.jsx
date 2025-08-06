import React, { useContext, useState, useEffect } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { MdClose } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import axios from "axios";
import { message } from "antd";
const AddMember = ({
  setMemberModal,
  onConfirm,
  adminDetails,
  setAdminDetails,
  isEditing,
  onProceed,
  setIsEditing,
  setEditMemberId,
  formatSnakeToTitle,
}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const token = localStorage.getItem("token");
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://itestify-backend-38u1.onrender.com";
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  // FETCH ALL ROLES ALREADY CREATED
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // setLoading(true);
        const response = await axios.get(`${API_URL}/auths/roles/all/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setRoles(response?.data?.data);
        console.log(response?.data?.data?.name);
      } catch (error) {
        message.error(error?.message);
        console.log(error);
        console.error(
          "Error fetching members:",
          error?.response || error?.message
        );
      } finally {
        // setLoading(false);
      }
    };

    fetchMembers();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails({ ...adminDetails, [name]: value });
  };

  const allRoles = roles.flatMap((admin) => admin.name);
  console.log(allRoles);
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
                {isEditing ? "Edit Member" : "Add Member"}
              </h1>
              <button
                className="cursor-pointer"
                aria-label="Close Modal"
                onClick={() => {
                  setMemberModal(false);
                  setIsEditing(false);
                  setEditMemberId(null);
                }}
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
                  disabled={isEditing}
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
                  disabled={isEditing}
                />
              </div>
              {/* Dropdown  */}
              <button
                onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                className={`w-full p-2 ${
                  isDarkMode
                    ? `bg-off-black hover:bg-zinc-800`
                    : `bg-off-white hover:bg-near-white`
                } flex items-center justify-between
               p-1 rounded-md outline-none text-sm placeholder:text-xs
               transition-colors duration-200`}
              >
                <span className="text-sm opacity-80 capitalize">
                  {selectedRole ? selectedRole : "Select Role"}
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
                  {allRoles.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedRole(option); 
                        setAdminDetails((prev) => ({
                          ...prev,
                          role: option, 
                        }));
                        setIsOpenDropdown(false);
                      }}
                      className={`p-2 cursor-pointer ${
                        isDarkMode
                          ? `text-white hover:bg-zinc-800 border-b-off-white`
                          : `text-black hover:bg-near-white border-b-borderColor`
                      } text-sm
                     transition-colors duration-150 border-t border-b`}
                    >
                      {formatSnakeToTitle(option)}
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
                onClick={() => {
                  setMemberModal(false);
                  setIsEditing(false);
                  setEditMemberId(null);
                }}
                className={`btn-secondary px-6 py-3 text-xs text-primary border-primary ${
                  isDarkMode ? `` : ` border-near-black `
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => {
                  adminDetails.role === "super_admin"
                    ? onConfirm()
                    : onProceed();
                }}
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

export default AddMember;
