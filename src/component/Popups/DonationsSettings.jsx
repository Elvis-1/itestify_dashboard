import React, { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { MdClose } from "react-icons/md";
export const DonationsSettings = ({
  setIsSettingsModal,
  setISSuccessModal,
}) => {
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
  const saveSettings = () => {
    setIsSettingsModal(false);
    setISSuccessModal(true);
    setTimeout(() => {
      setISSuccessModal(false);
    }, 2000);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsSettingsModal(false);
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
  const InputField = ({ label, id }) => (
    <div className="flex flex-col gap-2 pt-1">
      <label className="text-sm" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`${
          isDarkMode ? `bg-off-black` : `bg-off-white`
        } p-[5px] rounded-md outline-none text-sm placeholder:text-xs uppercase`}
        type="text"
      />
    </div>
  );
  const fields = [
    { label: "Account Holder", id: "acc-name" },
    { label: "Bank Name", id: "bank-name" },
    { label: "Account Number", id: "account-number" },
    { label: "Routing Number", id: "routing-number" },
    { label: "Swift Code", id: "swift-code" },
    { label: "Account Name", id: "account-name" },
  ];

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-scroll -top-48">
      <div
        className={`fixed inset-0 bg-opacity-50 ${
          isDarkMode ? "bg-black" : "bg-off-white"
        }`}
        onClick={handleBackdropClick}
      />
      <div
        className={`relative z-10 ${
          isDarkMode ? `bg-black` : `bg-white`
        } shadow-2xl rounded-lg w-[420px] px-3 mt-[40rem] modal`}
      >
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
              className={`p-2 rounded-md ${
                isDarkMode ? `bg-off-black` : `bg-off-white`
              } outline-none border-none h-24 w-full placeholder:text-xs text-sm`}
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
          <div className="grid grid-cols-2 place-items-center">
            {fields.map((field) => (
              <InputField label={field.label} key={field.id} id={field.id} />
            ))}
          </div>
          <div className="flex flex-col gap-2 pt-1 px-2">
            <label className=" text-sm" htmlFor="address">
              Address
            </label>
            <input
              className={`${
                isDarkMode ? `bg-off-black` : `bg-off-white`
              } p-[5px] rounded-md outline-none text-sm placeholder:text-xs uppercase`}
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
          <button onClick={saveSettings} className="btn-primary p-2 text-xs">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
