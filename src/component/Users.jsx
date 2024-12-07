import React, { useContext, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import RegUsers from "./userTypes/RegUsers";
import GuestUsers from "./userTypes/GuestUser";
import DelUsers from "./userTypes/DelUsers";

const Users = () => {
  const [userType, setUserType] = useState("registered");
  const { isDarkMode } = useContext(DarkModeContext);
  const userTypes = [
    { label: "Registered", value: "registered" },
    { label: "Guests", value: "guest" },
    { label: "Deleted accounts", value: "deleted" },
  ];
  return (
    <div className="p-5">
    
      <div className="flex items-center bg-[#292929] p-[5px] w-fit rounded-md">
        {userTypes.map((type) => (
          <p
            key={type.value}
            onClick={() => setUserType(type.value)}
            className={`${
              userType === type.value ? "bg-[#9966CC] text-white" : "text-gray-300"
            } px-2 py-2 text-sm rounded-lg cursor-pointer`}
          >
            {type.label}
          </p>
        ))}
      </div>
      {userType === "registered" && <RegUsers />}
      {userType === "guest" && <GuestUsers />}
      {userType === "deleted" && <DelUsers />}
    </div>
  );
};

export default Users;
