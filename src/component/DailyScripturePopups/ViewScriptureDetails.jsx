import React, { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { MdClose } from "react-icons/md";
const ViewScriptureDetails = ({ setIsScriptureDetails, scriptures }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`fixed inset-0 bg-opacity-50 ${
          isDarkMode ? "bg-black" : "bg-off-white"
        }`}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div
          className={`rounded-lg modal ${
            isDarkMode ? "bg-near-black text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex items-center justify-between w-full border-b border-[#787878] p-3">
            <h1 className="text-xl">Scripture Details</h1>
            <button
              className="cursor-pointer"
              aria-label="Close Modal"
              onClick={() => setIsScriptureDetails(false)}
            >
              <MdClose />
            </button>
          </div>
          <div className="p-3 flex flex-col gap-3 border-b border-b-[#787878]">
            <h4 className="text-sm">Scripture</h4>
            <p className="text-xs">{scriptures?.scripture || "---"}</p>
          </div>
          <div className="p-3 flex flex-col gap-3 border-b border-b-[#787878]">
            <h4 className="text-sm">Prayer</h4>
            <p className="text-xs">{scriptures?.prayer || "---"}</p>
          </div>
          <div className="p-3 flex flex-col gap-3 border-b border-b-[#787878]">
            <h4 className="text-sm">Bible Verse</h4>
            <p className="text-xs">{scriptures?.bibleVerse || "---"}</p>
          </div>
          <div className="p-3 flex flex-col gap-3 border-b border-b-[#787878]">
            <h4 className="text-sm">Bible Version</h4>
            <p className="text-xs">{scriptures?.bibleVersion || "---"}</p>
          </div>
          {scriptures.status === "scheduled" && (
            <div>
              <div className="p-3 flex flex-col gap-3 border-b border-b-[#787878]">
                <h4 className="text-sm">Schdeuled Date</h4>
                <p className="text-xs">{scriptures?.selectedDate || "---"}</p>
              </div>
              <div className="p-3 flex flex-col gap-3 border-b border-b-[#787878]">
                <h4 className="text-sm">Scheduled Time</h4>
                <p className="text-xs">
                  {scriptures?.selectedTime +
                    "" +
                    scriptures?.selectedTimeFormat || "---"}
                </p>
              </div>
            </div>
          )}
          <div className="p-3 flex flex-col gap-3 ">
            <h4 className="text-sm">Status</h4>
            <p
              className={`text-xs border ${
                scriptures.status === "uploaded"
                  ? `border-green-600 text-green-600`
                  : `border-[#FFC107] text-[#FFC107]`
              }  rounded-lg p-2  w-fit`}
            >
              {scriptures?.status || "---"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewScriptureDetails;
