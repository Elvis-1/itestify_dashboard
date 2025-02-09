import React, { useContext, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { regUsers } from "../data/userdetails";
const UsersAnalytics = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [registeredUser] = useState(regUsers);
  const totalUsers = registeredUser.map((user) => user);
  return (
    <div className={`p-5 h-screen  ${isDarkMode ? "bg-black" : "bg-off-white"}`}>
      <div className="flex w-full justify-between items-center pb-5">
        <p>Analytics</p>
        <input
          className={`bg-off-black rounded-md pl-2 p-1 w-[200px] placeholder:text-off-black ${
            isDarkMode ? "bg-off-black" : "bg-white"
          } p-1 rounded-md outline-none text-sm placeholder:text-xs`}
          placeholder="Yesterday (Nov 15 ,2024)"
          type="date"
        />
      </div>
      <div className="flex items-center justify-between w-full gap-10 pb-4">
        <div
          className={`w-1/2 rounded-xl p-2 ${
            isDarkMode ? "bg-grayBlack text-white" : "bg-white text-black "
          }`}
        >
          <p className="text-[13px] pl-3">Total Users</p>
          <hr className="w-[95%] m-[auto] mt-1" />
          <p className="text-[13px] pl-3 pt-3">
            {totalUsers.length.toLocaleString()}
          </p>
        </div>
        <div
          className={`w-1/2 rounded-xl p-2  ${
            isDarkMode ? "bg-grayBlack text-white" : "bg-white text-black "
          }`}
        >
          <p className="text-[13px] pl-3">New users</p>
          <hr className="w-[95%] m-[auto] mt-1" />
          <p className="text-[13px] pl-3 pt-3">10</p>
        </div>
      </div>
    </div>
  );
};

export default UsersAnalytics;
