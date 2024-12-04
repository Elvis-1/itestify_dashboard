import React, { useContext, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import { DarkModeContext } from "../context/DarkModeContext";
import RegUsers from "./userTypes/RegUsers";
import GuestUsers from "./userTypes/GuestUser";
import DelUsers from "./userTypes/DelUsers";
import { UserContext } from "../context/UserContext";

const Users = () => {
  const [userType, setUserType] = useState("registered");
  const { isDarkMode } = useContext(DarkModeContext);
  const userTypes = [
    { label: "Registered", value: "registered" },
    { label: "Guests", value: "guest" },
    { label: "Deleted accounts", value: "deleted" },
  ];
  const { handleDeleteSelected, selectedItems } = useContext(UserContext);

  return (
    <div className="p-5">
      <div className="flex items-center bg-[#292929] p-1 w-fit rounded-md">
        {userTypes.map((type) => (
          <p
            key={type.value}
            onClick={() => setUserType(type.value)}
            className={`${
              userType === type.value ? "bg-[#9966CC]" : ""
            } px-2 py-2 text-sm rounded-sm text-white cursor-pointer`}
          >
            {type.label}
          </p>
        ))}
      </div>
      <div className="flex justify-between items-center w-full">
        <h3 className="py-5 text-lg">User Management</h3>
        <div className="flex items-center gap-4">
          {selectedItems.length > 0 && (
            <div
              onClick={handleDeleteSelected}
              className="flex items-center justify-normal gap-1 p-2 bg-[#E53935] rounded-md cursor-pointer hover:bg-[#E23920]"
            >
              <i>
                <RiDeleteBin6Line />
              </i>
              <p className="text-xs">Delete</p>
            </div>
          )} 
          <div
            className={`flex justify-left items-center gap-2  p-2 rounded-lg w-[300px] ${
              isDarkMode ? `bg-[#171717]` : `bg-gray-200`
            }`}
          >
            <SearchOutlined style={{ fontSize: "16px" }} />
            <input
              className="border-none outline-none bg-[#171717] placeholder:text-xs"
              type="text"
              name="search"
              id="search-user"
              placeholder="Search by name, email, userID"
            />
          </div>
        </div>
      </div>
      {userType === "registered" && <RegUsers />}
      {userType === "guest" && <GuestUsers />}
      {userType === "deleted" && <DelUsers />}
      <div className="flex justify-between items-center w-full pt-32 pb-20 px-4">
        <p>Showing 1-9 of 9</p>
        <div className="flex gap-2 items-center">
          <button className="px-4 py-2 border-2 border-[#575757] rounded-md hover:border-[#9966CC]">
            Previous
          </button>
          <button className="px-4 py-2 border-2 border-[#575757] rounded-md hover:border-[#9966CC]">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
