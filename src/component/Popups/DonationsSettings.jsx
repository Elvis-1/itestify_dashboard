import React, { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { MdClose } from "react-icons/md";
export const DonationsSettings = ({ isSettingsModal, setIsSettingsModal }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [characters, setCharacters] = useState("");
  const [donationMethods, setDonationMethods] = useState({
    bankTransfer: false,
    cardPayment: false,
  });
  const [toggleStates, setToggleStates] = useState({
    notifyAdmin: true,
    notifyUsersFailed: false,
    sendThankYou: false,
  });
  const checkStatesToggle = (name) => {
    setToggleStates((prevData) => ({
      ...prevData,
      [name]: !prevData[name],
    }));
  };
  const donationMethodsToggle = (method) => {
    if (method === "bankTransfer") {
      setDonationMethods({
        bankTransfer: true,
        cardPayment: false,
      });
    } else {
      setDonationMethods({
        bankTransfer: false,
        cardPayment: true,
      });
    }
  };
  const ToggleSwitch = ({ id, label, description, checked, onChange }) => (
    <div className="flex items-center justify-between pb-3">
      <div>
        <h4 className="text-[14px]">{label}</h4>
        <p className="text-xs text-near-white">{description}</p>
      </div>
      <div className="flex items-center justify-between relative my-0 mx-2">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={() => onChange(id)}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className="inline-flex relative items-center cursor-pointer"
        >
          <div className="w-11 h-6 rounded-full transition-colors bg-primary">
            <div
              className={`absolute top-[2px] right-[3px] w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform ${
                !checked ? "-translate-x-full border-white" : ""
              }`}
            ></div>
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-scroll mt-24">
      <div
        className={`fixed inset-0 bg-opacity-50 ${
          isDarkMode ? "bg-black" : "bg-off-white"
        }`}
      />
      <div className="relative z-10 bg-black shadow-2xl rounded-lg w-[420px] px-3 mt-[40rem]">
        <div className="flex justify-between items-center p-3 border-b-[1px] border-b-near-white">
          <h2 className="text-xl">Donations</h2>
          <i
            className="cursor-pointer"
            onClick={() => {
              setIsSettingsModal(false);
            }}
          >
            <MdClose />
          </i>
        </div>
        <div className="p-3 border-b-[1px] border-b-near-white">
          <ToggleSwitch
            id="notifyAdmin"
            label="Notify Admin after Donations"
            description="Enable to notify the admin after a user submits a donation for verification"
            checked={toggleStates.notifyAdmin}
            onChange={checkStatesToggle}
          />
          <ToggleSwitch
            id="notifyUsersFailed"
            label="Notify Users after failed Donations"
            checked={toggleStates.notifyUsersFailed}
            description="Send a notification to users when a donation cannot be verified"
            onChange={checkStatesToggle}
          />
          <ToggleSwitch
            id="sendThankYou"
            label="Send thank you email to users after donations"
            description="Automatically send a thank-you email to users once their
                donation is verified"
            checked={toggleStates.sendThankYou}
            onChange={checkStatesToggle}
          />
          <div>
            <h4 className="text-[14px] py-1">Thank you Email</h4>
            <textarea
              className="p-2 rounded-md bg-off-black outline-none border-none h-24 w-full placeholder:text-xs text-sm"
              placeholder="Type here..."
              value={characters}
              onChange={(e) => {
                setCharacters(e.target.value);
              }}
              maxLength={100}
            ></textarea>
            <p className="flex justify-end mr-auto text-xs text-near-white">
              {characters.length}/100 words
            </p>
          </div>
        </div>

        {/* <------------------------------------- DONATION METHODS---------------------------------------> */}
        <div className="p-3 border-b-[1px] border-b-near-white">
          <h3 className="py-2">Donation Methods</h3>
          <div className="flex justify-between items-center">
            <div className="flex justify-normal items-center gap-1">
              <input
                type="checkbox"
                name="transfers"
                id=""
                checked={donationMethods.bankTransfer}
                onChange={() => {
                  donationMethodsToggle("bankTransfer");
                }}
              />
              <label className="text-xs">Bank Transfers</label>
            </div>
            <div className="flex justify-normal items-center gap-1">
              <input
                type="checkbox"
                name="card"
                id=""
                checked={donationMethods.cardPayment}
                onChange={() => {
                  donationMethodsToggle("cardPayment");
                }}
              />
              <label className="text-xs">Card Payments</label>
            </div>
          </div>
        </div>
        {/* <-------------------------------------------NAIRA DONATIONS ---------------------------------------> */}
        <div className="p-3 border-b-[1px] border-b-near-white ">
          <h3 className="py-2 text-[16px]">NGN Donations</h3>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <label className=" text-sm" htmlFor="acc-name">
                Account Name
              </label>
              <input
                className="bg-off-black p-[5px] rounded-md outline-none text-sm placeholder:text-xs uppercase"
                type="text"
                placeholder="e.g JOHN DOE SMART"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className=" text-sm" htmlFor="bank-name">
                Bank Name
              </label>
              <input
                className="bg-off-black p-[5px] rounded-md outline-none text-sm placeholder:text-xs uppercase"
                type="text"
                placeholder="e.g SMART BANK"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 py-2">
            <label className=" text-sm" htmlFor="acc-number">
              Account Number
            </label>
            <input
              className="bg-off-black p-[5px] rounded-md outline-none text-sm placeholder:text-xs uppercase"
              type="text"
              placeholder="e.g 1234567890"
            />
          </div>
        </div>
        {/* <------------------------------------------DOLLAR DONATION--------------------------------------------> */}
        <div className="p-3">
          <h3 className="py-2 text-[16px]">USD Donations</h3>
          <div className="grid grid-cols-2 place-items-center">
            <div className="flex flex-col gap-2">
              <label className=" text-sm" htmlFor="acc-name">
                Account Holder
              </label>
              <input
                className="bg-off-black p-[5px] rounded-md outline-none text-sm placeholder:text-xs uppercase"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <label className=" text-sm" htmlFor="bank-name">
                Bank Name
              </label>
              <input
                className="bg-off-black p-[5px] rounded-md outline-none text-sm placeholder:text-xs uppercase"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <label className=" text-sm" htmlFor="bank-name">
                Account Number
              </label>
              <input
                className="bg-off-black p-[5px] rounded-md outline-none text-sm placeholder:text-xs uppercase"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <label className=" text-sm" htmlFor="bank-name">
                Routing Number
              </label>
              <input
                className="bg-off-black p-[5px] rounded-md outline-none text-sm placeholder:text-xs uppercase"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <label className=" text-sm" htmlFor="bank-name">
                Swift Code
              </label>
              <input
                className="bg-off-black p-[5px] rounded-md outline-none text-sm placeholder:text-xs uppercase"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <label className=" text-sm" htmlFor="bank-name">
                Account Name
              </label>
              <input
                className="bg-off-black p-[5px] rounded-md outline-none text-sm placeholder:text-xs uppercase"
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-1 px-2">
            <label className=" text-sm" htmlFor="acc-number">
              Address
            </label>
            <input
              className="bg-off-black p-[5px] rounded-md outline-none text-sm placeholder:text-xs uppercase"
              type="text"
            />
          </div>
        </div>
        <div className="flex justify-end ml-auto my-12 gap-2">
          <button
            className="btn-secondary text-xs border-primary text-primary"
            onClick={() => {
              setIsSettingsModal(false);
            }}
          >
            Cancel
          </button>
          <button className="btn-primary p-2 text-xs">Save Settings</button>
        </div>
      </div>
    </div>
  );
};
