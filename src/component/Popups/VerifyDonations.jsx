import React from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";
export const VerifyDonations = ({ setIsVerified }) => {
  return (
    <div className="fixed inset-0 z-50 bg-opacity-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full  max-w-sm shadow-2xl">
      <div className="bg-near-black rounded-lg modal">
        <div className="flex items-center justify-between w-full border-b-[1px] border-b-off-white p-3">
          <h1 className="text-white text-lg">Verify Details </h1>
          <i
            className="cursor-pointer"
            onClick={() => {
              setIsVerified(false);
            }}
          >
            <MdClose />
          </i>
        </div>
        <div className="p-4 ">
          <div className="flex flex-col gap-3">
            <label className="text-sm" htmlFor="amount">
              Amount
            </label>
            <input
              className="bg-off-black p-2 rounded-md outline-none text-sm"
              type="number"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm" htmlFor="amount">
              Currency
            </label>
            <input
              className="bg-off-black p-2 rounded-md outline-none text-sm uppercase" placeholder="Select"
              type="select"
            />
          </div>
          <div className="flex items-center gap-3 mt-16 justify-end ml-auto">
            <button
              onClick={() => {
                setIsVerified(false);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button className="btn-primary">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
