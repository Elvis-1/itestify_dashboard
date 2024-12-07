import React from "react";
import avatarProfile from "../../assets/images/Design/Dashboard/avatar.png";
import { MdClose } from "react-icons/md";
export const UserProfile = ({setProfile}) => {
  return (
    <div className="fixed bg-black inset-0 z-50 bg-opacity-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full  max-w-md">
      <div className=" rounded-lg">
        <i
          onClick={() => {
            setProfile(false);
          }}
          className="absolute w-24 top-4 z-10 -right-16 cursor-pointer"
        >
          <MdClose />
        </i>
        <div className="bg-[#292929] h-36 w-full relative">
          <img
            className="flex justify-center items-center w-24 h-24 absolute top-[60%] left-[38%]"
            src={avatarProfile}
            alt=""
          />
        </div>

        <div className="bg-black p-4 ">
          <div className="flex justify-between items-center w-full py-2">
            <p>User ID</p>
            <p>U10892</p>
          </div>
          <div className="flex justify-between items-center w-full py-2">
            <p>Name</p>
            <p>U10892</p>
          </div>
          <div className="flex justify-between items-center w-full py-2">
            <p>Email</p>
            <p>U10892</p>
          </div>
          <div className="flex justify-between items-center w-full py-2">
            <p>Status</p>
            <p className="text-green-600">Registered</p>
          </div>
          <div className="flex justify-between items-center w-full py-2">
            <p>Regsitration date</p>
            <p>U10892</p>
          </div>
        </div>
      </div>
    </div>
  );
};
