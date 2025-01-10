import React, { useContext } from "react";
import avatarProfile from "../../assets/images/avatar.png";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";

const UserRegProfile = ({ registeredUsers, setProfile }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  if (!registeredUsers) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Non-clickable overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
      />

      {/* Modal container */}
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md shadow-lg`}
      >
        <div className="modal">
          <i
            onClick={() => {
              setProfile(false);
            }}
            className="absolute w-24 top-4 z-10 -right-16 cursor-pointer"
          >
            <MdClose />
          </i>
          <div
            className={`h-36 w-full relative rounded-t-2xl ${
              isDarkMode ? `bg-[#292929]` : `bg-off-white`
            }`}
          >
            <img
              className="flex justify-center items-center w-24 h-24 absolute top-[60%] left-[38%]"
              src={avatarProfile}
              alt=""
            />
          </div>

          <div
            className={`bg-black p-4 rounded-b-2xl ${
              isDarkMode ? `dark-mode` : `light-mode`
            }`}
          >
            <div className="flex justify-between items-center w-full py-2">
              <p>User ID</p>
              <p>{registeredUsers?.userId || "----"}</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <p>Name</p>
              <p>{registeredUsers?.name || "----"}</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <p>Email</p>
              <p>{registeredUsers?.email || "----"}</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <p>Status</p>
              <p className="text-green-600">Registered</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <p>Registration date</p>
              <p>{registeredUsers?.regDate || "----"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegProfile;
