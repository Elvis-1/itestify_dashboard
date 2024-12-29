import React from "react";
import { MdClose } from "react-icons/md";
export const DonationsDetails = ({ setIsUserDetails, pendingDonations }) => {
  return (
    <div className="fixed inset-0 z-50 bg-opacity-50 top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full  max-w-sm">
      <div className="bg-near-black rounded-lg">
        <div className="flex items-center justify-between w-full border-b-[1px] border-b-white p-3">
          <h1 className="text-white text-lg">Donation Details </h1>
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
          <img
            className="w-32 m-auto py-3"
            src={pendingDonations.image}
            alt=""
          />
          <div className="flex justify-between items-center w-full py-2">
            <p>Email</p>
            <p>{pendingDonations.email}</p>
          </div>
          <div className="flex justify-between items-center w-full py-2">
            <p>Verification code</p>
            <p>{pendingDonations.verificationCode}</p>
          </div>
          <div className="flex justify-between items-center w-full py-2">
            <p>Date</p>
            <p>{pendingDonations.date}</p>
          </div>
          <div className="flex justify-between items-center w-full py-2">
            <p>Amount</p>
            <p>{pendingDonations.amount}</p>
          </div>
          <div className="flex justify-between items-center w-full py-2">
            <p>Currency</p>
            <p>{pendingDonations.currency}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
