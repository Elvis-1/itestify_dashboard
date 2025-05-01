import React, { useContext, useState, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import { DarkModeContext } from "../context/DarkModeContext";
import AllScriptures from "../component/scriptureStatus/AllScriptures";
import UploadedScriptures from "../component/scriptureStatus/UploadedScriptures";
import ScheduledScriptures from "../component/scriptureStatus/ScheduledScriptures";
import { ScriptureContext } from "../context/ScriptureContext";
import { Link } from "react-router-dom";
import SuccessModal from "../component/DailyScripturePopups/SuccessModal";

const ScriptureForDay = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { scriptureUploadedDetails, setScriptureUploadedDetails } =
    useContext(ScriptureContext);
  const [Status, setStatus] = useState("All");
  const [editModal, setEditModal] = useState(false);
  const scriptureStatus = [
    { status: "All" },
    { status: "Uploaded" },
    { status: "Scheduled" },
  ];

  const [isSuccessModal, setIsSuccessModal] = useState(false);
  useEffect(() => {
    if (isSuccessModal) {
      const timeout = setTimeout(() => {
        setIsSuccessModal(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isSuccessModal]);
  return (
    <div className={`${isDarkMode ? `bg-black` : `bg-off-white`}`}>
      {isSuccessModal && (
        <SuccessModal successMessage="Scripture deleted Successfully!" />
      )}
      <div className={`p-5 ${isDarkMode ? `bg-black` : `bg-off-white`}`}>
        <button className=" flex justify-end ml-auto p-2 rounded-md bg-primary cursor-pointer">
          <Link
            to="/dashboard/upload-scripture"
            className="flex justify-end gap-1 ml-auto"
          >
            <IoAdd fill="#ffffff" />
            <span className="text-white text-xs">Upload New Scripture</span>
          </Link>
        </button>
        <div
          className={`${
            isDarkMode ? `bg-lightBlack` : `bg-white`
          } rounded-lg mt-6`}
        >
          <p className="font-medium px-4 pt-4">Scripture of the day</p>
          <div className="flex justify-between items-center px-4 py-2">
            <div className="flex gap-3 py-4">
              {scriptureStatus.map((status, index) => (
                <div key={index}>
                  <p
                    onClick={() => setStatus(status.status)}
                    className={`cursor-pointer border-b-[2px] pb-1 text-sm ${
                      Status === status.status
                        ? `border-b-primary ${
                            isDarkMode ? `text-white` : `text-black`
                          }`
                        : `border-b-transparent ${
                            isDarkMode ? `text-off-white` : `text-off-black`
                          }`
                    } hover:border-b-primary`}
                  >
                    {status.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {Status === "All" && (
            <AllScriptures
              scriptures={scriptureUploadedDetails}
              setScriptures={setScriptureUploadedDetails}
            />
          )}
          {Status === "Uploaded" && (
            <UploadedScriptures
              scriptures={scriptureUploadedDetails}
              isSuccessModal={isSuccessModal}
              setIsSuccessModal={setIsSuccessModal}
              editModal={editModal}
              setEditModal={setEditModal}
            />
          )}
          {Status === "Scheduled" && (
            <ScheduledScriptures
              scriptures={scriptureUploadedDetails}
              isSuccessModal={isSuccessModal}
              setIsSuccessModal={setIsSuccessModal}
              editModal={editModal}
              setEditModal={setEditModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScriptureForDay;
