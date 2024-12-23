import React, { useContext, useState } from "react";
import { RiSettings5Line} from "react-icons/ri";
import { DarkModeContext } from "../context/DarkModeContext";
import AllDonations from "../component/donationTypes/AllDonations";
import Verified from "../component/donationTypes/Verified";
import Pending from "../component/donationTypes/Pending";
import Failed from "../component/donationTypes/Failed";

const Donations = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [userType, setUserType] = useState("All");

  const donateUserType = [
    { user: "All" },
    { user: "Pending" },
    { user: "Verified" },
    { user: "Failed" },
  ];
  return (
    <div className="m-5">
      <button
        className="flex justify-end gap-1 p-2 rounded-md border-2 
        border-primary cursor-pointer ml-auto"
      >
        <RiSettings5Line fill="#9966cc" />
        <span className="text-primary text-sm">Manage Settings</span>
      </button>
      <div className={`flex justify-between items-center w-full  pb-3`}>
        <h3 className="py-5 ">Donations</h3>
      </div>
      <div>
        <div className="flex gap-3 pb-3">
          {donateUserType.map((user, index) => (
            <div key={index}>
              <p
                onClick={() => setUserType(user.user)}
                className={`cursor-pointer border-b-2 border-b-transparent pb-1 hover:border-b-2 hover:border-b-primary text-sm ${
                  userType == user.user
                    ? ` border-b-primary`
                    : `border-b-transparent`
                }`}
              >
                {user.user}
              </p>
            </div>
          ))}
        </div>

        {userType === "All" && <AllDonations donateUserType={userType}/>}
        {userType === "Verified" && <Verified />}
        {userType === "Pending" && <Pending />}
        {userType === "Failed" && <Failed />}
      </div>
    </div>
  );
};

export default Donations;
