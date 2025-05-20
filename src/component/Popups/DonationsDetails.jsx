import React, { useContext } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";
import "../../styles/animation.css";

const DonationsDetails = ({ setIsUserDetails, DonationUser }) => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50"
        onClick={() => setIsUserDetails(false)} 
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center modal mt-5">
        <div
          className={`rounded-lg shadow-lg w-full max-w-sm ${
            isDarkMode ? "dark-mode bg-black text-white" : "bg-off-white text-black"
          }`}
        >
          <div className="flex items-center justify-between w-full border-b-[1px] border-gray-300 p-3">
            <h1 className="text-lg">Donation Details</h1>
            <i
              className="cursor-pointer"
              onClick={() => {
                setIsUserDetails(false);
              }}
            >
              <MdClose />
            </i>
          </div>
          <div className="px-3 py-4">
            <img className="w-32 m-auto py-3" src={DonationUser.image} alt="Donation" />
            <div className="flex justify-between items-center w-full py-2">
              <p>Email</p>
              <p>{DonationUser.email}</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <p>Verification code</p>
              <p>{DonationUser.verificationCode}</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <p>Date</p>
              <p>{DonationUser.date}</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <p>Amount</p>
              <p>{DonationUser.amount}</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <p>Currency</p>
              <p>{DonationUser.currency}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationsDetails;
