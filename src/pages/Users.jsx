import React, { useContext, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import RegUsers from "../component/userTypes/RegUsers";
import DelUsers from "../component/userTypes/DelUsers";

const Users = () => {
  const [userType, setUserType] = useState("registered");
  const { isDarkMode } = useContext(DarkModeContext);
  const userTypes = [
    { label: "Registered", value: "registered" },
    { label: "Deleted accounts", value: "deleted" },
  ];
  return (
    <div className={`p-5 ${isDarkMode? `bg-black`: `bg-off-white`}`}>
    
      <div className={` ${isDarkMode? ` bg-off-black`: `bg-white`} flex items-center p-[5px] w-fit rounded-md`}>
        {userTypes.map((type) => (
          <p
            key={type.value}
            onClick={() => setUserType(type.value)}
            className={`${
              userType === type.value ? ` bg-primary text-white` : `${isDarkMode? `text-gray-300`: `text-black`}`
            } px-2 py-2 text-sm rounded-lg cursor-pointer`}
          >
            {type.label}
          </p>
        ))}
      </div>
      {userType === "registered" && <RegUsers />}
      {userType === "deleted" && <DelUsers />}
    </div>
  );
};

export default Users;
