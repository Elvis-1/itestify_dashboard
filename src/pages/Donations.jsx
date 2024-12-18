import React, { useContext, useState } from "react";
import { RiSettings5Line, RiFilter3Line } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import { DarkModeContext } from "../context/DarkModeContext";
import AllDonations from "../component/donationTypes/AllDonations";
import Verified from "../component/donationTypes/Verified";
import Pending from "../component/donationTypes/Pending";
import Failed from "../component/donationTypes/Failed";
const Donations = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [searchItem, setSearchItem] = useState("");
  const [userType, setUserType] = useState("All");
  const donateUserType = [
    { user: "All" },
    { user: "Pending" },
    { user: "Verified" },
    { user: "Failed" },
  ];
  return (
    <div className="m-5">
      <div className="flex justify-end w-fit justify-items-end items-center gap-1 p-2 rounded-md border-2 border-primary cursor-pointer">
        <i>
          <RiSettings5Line fill="#9966cc" />
        </i>
        <button className=" text-primary text-sm">Manage Settings</button>
      </div>
      <div className={`flex justify-between items-center w-full  pb-3`}>
        <h3 className="py-5 ">Donations</h3>
        <div className="flex items-center gap-4">
          {/*---------------------------------------- Search Bar  ---------------------------------*/}
          <div
            className={`flex justify-left items-center gap-2  p-3 rounded-lg w-[300px] ${
              isDarkMode ? `bg-off-black` : `bg-off-white`
            } ]
                    `}
          >
            <SearchOutlined
              style={{
                fill: isDarkMode ? "black" : "white",
                fontSize: "16px",
              }}
            />
            <input
              className="border-none outline-none bg-transparent w-[200px] text-xs placeholder:text-xs"
              type="text"
              name="search"
              id="search-user"
              placeholder="Search by Email"
              onChange={(e) => {
                setSearchItem(e.target.value);
              }}
            />
          </div>
          <div className="flex justify-center items-center gap-1 p-2 rounded-md border-2 border-primary cursor-pointer ">
            <i>
              <RiFilter3Line fill="#9966cc" />
            </i>
            <p className=" text-primary text-sm">Filter</p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex gap-3 pb-3">
          {donateUserType.map((user, index) => (
            <div key={index}>
              <p
                onClick={() => setUserType(user.user)}
                className={`cursor-pointer border-b-2 border-b-transparent pb-1 hover:border-b-2 hover:border-b-primary text-sm ${userType== user.user? ` border-b-primary`: `border-b-transparent` }`}
              >
                {user.user}
              </p>
            </div>
          ))}
        </div>
        {userType === "All" && (
          <AllDonations donateUserType={donateUserType} />
        )}
         {userType === "Verified" && (
          <Verified donateUserType={donateUserType} />
        )}
         {userType === "Pending" && (
          <Pending donateUserType={donateUserType} />
        )}
         {userType === "Failed" && (
          <Failed donateUserType={donateUserType} />
        )}
      </div>
    </div>
  );
};

export default Donations;
