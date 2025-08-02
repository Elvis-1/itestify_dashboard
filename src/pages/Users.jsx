import { useContext, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import RegUsers from "../component/userTypes/RegUsers";
import DelUsers from "../component/userTypes/DelUsers";
import DeactivatedAccount from "../component/userTypes/DeactivatedAccount";

import { message } from "antd";

const Users = () => {
  const [userType, setUserType] = useState("registered");
  const { isDarkMode } = useContext(DarkModeContext);

  const userTypes = [
    { label: "Registered", value: "registered" },
    { label: "Deleted Accounts", value: "deleted" },
    { label: "Deactivated Accounts", value: "deactivated" },
  ];
  const handleExportCSV = () => {
    let data = [];

    if (userType === "registered") {
      data = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    } else if (userType === "deleted") {
      data = JSON.parse(localStorage.getItem("deletedUsers")) || [];
    } else if (userType === "deactivated") {
      data = JSON.parse(localStorage.getItem("deactivatedUsers")) || [];
    }
    if (!data.length) {
      message.warning("No data available to export.");
      return;
    }

    const headers = Object.keys(data[0]);
    const rows = data.map((user) => headers.map((key) => user[key]));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${userType}_users.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`p-5 ${isDarkMode ? `bg-black` : `bg-off-white`} h-screen`}>
      {/* Top Bar with Tabs and CSV Button */}
      <div className="flex justify-between items-center mb-4">
       
        <div
          className={`${
            isDarkMode ? `bg-off-black` : `bg-white`
          } flex items-center p-[5px] w-fit rounded-md`}
        >
          {userTypes.map((type) => (
            <p
              key={type.value}
              onClick={() => setUserType(type.value)}
              className={`text-xs ${
                userType === type.value
                  ? `bg-primary text-white`
                  : `${isDarkMode ? `text-gray-300` : `text-black`}`
              } px-2 py-2 text-sm rounded-lg cursor-pointer`}
            >
              {type.label}
            </p>
          ))}
        </div>

        <button
          onClick={handleExportCSV}
          className="text-xs border-2 border-[#9966CC] hover:bg-[#663380] hover:text-white text-[#9966CC] py-2 px-4 rounded-lg transition-all duration-200"
        >
          Export as CSV file
        </button>
      </div>

      {userType === "registered" && <RegUsers />}
      {userType === "deleted" && <DelUsers />}
      {userType === "deactivated" && <DeactivatedAccount />}
    </div>
  );
};

export default Users;
