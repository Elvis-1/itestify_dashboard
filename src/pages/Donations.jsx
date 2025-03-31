import React, { useContext, useState, useEffect } from "react";
import { RiSettings5Line } from "react-icons/ri";
import { DarkModeContext } from "../context/DarkModeContext";
import AllDonations from "../component/donationTypes/AllDonations";
import Verified from "../component/donationTypes/Verified";
import Pending from "../component/donationTypes/Pending";
import Failed from "../component/donationTypes/Failed";
import { DonationsSettings } from "../component/Popups/DonationsSettings";
import SuccessModal from "../component/Popups/SuccessModal";

const Donations = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [userType, setUserType] = useState("All");
  const [isSettingsModal, setIsSettingsModal] = useState(false);
  const [isSuccessModal, setISSuccessModal] = useState(false);

  const donateUserType = [
    { user: "All" },
    { user: "Pending" },
    { user: "Verified" },
    { user: "Failed" },
  ];

  useEffect(() => {
    if (isSuccessModal) {
      const timeout = setTimeout(() => {
        setISSuccessModal(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isSuccessModal]);

  return (
    <div className={`${isDarkMode? `bg-black`: `bg-off-white`} `}>
    <div className={`p-5 ${isDarkMode ? `bg-black` : `bg-off-white`}`}>
      {isSettingsModal && (
        <DonationsSettings
          isSettingsModal={isSettingsModal}
          setIsSettingsModal={setIsSettingsModal}
          setISSuccessModal={setISSuccessModal}
        />
      )}
      {isSuccessModal && (
        <SuccessModal sucessMessage="Settings Saved Successfully!" />
      )}
      <button
        onClick={() => {
          setIsSettingsModal(!isSettingsModal);
        }}
        className="flex justify-end gap-1 p-2  rounded-md border-2 
        border-primary cursor-pointer ml-auto"
      >
        <RiSettings5Line fill="#9966cc" />
        <span className="text-primary text-sm">Manage Settings</span>
      </button>
      <div
        className={`${
          isDarkMode ? `bg-lightBlack` : `bg-white`
        } rounded-lg mt-6 pb-2`}
      >
        <div className="flex gap-3 p-3 py-4">
          {donateUserType.map((user, index) => (
            <div key={index}>
              <p
                onClick={() => setUserType(user.user)}
                className={`cursor-pointer border-b-[2px] pb-1 text-sm ${
                  userType === user.user
                    ? "border-b-primary"
                    : "border-b-transparent"
                } hover:border-b-primary`}
              >
                {user.user}
              </p>
            </div>
          ))}
        </div>

        {userType === "All" && <AllDonations donateUserType={userType} />}
        {userType === "Verified" && <Verified />}
        {userType === "Pending" && <Pending />}
        {userType === "Failed" && <Failed />}
      </div>
    </div>
    </div>
  );
};

export default Donations;
