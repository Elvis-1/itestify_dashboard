import React, { useContext } from "react";
import avatarProfile from "../../assets/images/avatar.png";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";
import "../../styles/animation.css";

const UserDelProfile = ({ deletedUsers, setProfile }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  if (!deletedUsers) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Non-clickable overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"

      />

      {/* Modal container */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="rounded-lg modal">
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
              <p>{deletedUsers?.userId || "----"}</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <p>Name</p>
              <p>{deletedUsers?.name || "----"}</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <p>Email</p>
              <p>{deletedUsers?.email || "----"}</p>
            </div>
            <div className="flex justify-between items-center w-full py-2 ">
              <p>Status</p>
              <p className="text-red">Deleted</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <p>Deletion date</p>
              <p>{deletedUsers?.deletionDate || "----"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDelProfile;
