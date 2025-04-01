import React, { useContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";
import SuccessModal from "../component/DailyScripturePopups/SuccessModal";
const UploadScriptures = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const radioButtons = [
    { id: 1, label: "Upload now", value: "UploadNow" },
    { id: 2, label: "Schedule for later", value: "ScheduleForLater" },
    { id: 3, label: "Drafts", value: "Drafts" },
  ];
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate= useNavigate()
  const [scriptureUpload, setScriptureUpload] = useState({
    scripture: "",
    prayer: "",
    bibleText: "",
    bibleVersion: "",
    selectedOption: "",
    selectedDate: "",
    selectedTime: "",
    selectedTimeFormat: "AM",
  });
  const handleRadioChange = (e) => {
    setScriptureUpload((prev) => ({
      ...prev,
      selectedOption: e.target.value,
    }));
    console.log(e.target.value);
  };
  useEffect(() => {
    if (isSuccessModal) {
      const timeout = setTimeout(() => {
        setIsSuccessModal(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isSuccessModal]);

  const submitScripture = () => {
    
    console.log(scriptureUpload);
    setSelectedOption(scriptureUpload.selectedOption)
    setIsSuccessModal(true);
    setTimeout(() => {
      navigate("/dashboard/daily-scripture"); 
    }, 2000);

    setScriptureUpload({
      scripture: "",
      prayer: "",
      bibleText: "",
      bibleVersion: "",
      selectedOption: "",
      selectedDate: "",
      selectedTime: "",
      selectedTimeFormat: "",
    });
  };
  const uploadScripture=()=>{
    
  }
  return (
    <div className={`${isDarkMode ? `bg-black` : `bg-off-white`} `}>
      {isSuccessModal && (
       <SuccessModal
          successMessage={
            selectedOption === "UploadNow"
              ? "Scripture Uploaded Successfully"
              : selectedOption === "Drafts"
              ? "Scripture Saved as Draft Successfully"
              : "Scripture Scheduled Successfully"
          }
        />
      )}
      <div className={`p-5 ${isDarkMode ? `bg-black` : `bg-off-white`}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold ">Upload New Scriptures</h2>
          <button
            disabled={
              !scriptureUpload.scripture ||
              !scriptureUpload.bibleText ||
              !scriptureUpload.bibleVersion ||
              !scriptureUpload.prayer ||
              (scriptureUpload.selectedOption === "ScheduleForLater" &&
                (!scriptureUpload.selectedDate ||
                  !scriptureUpload.selectedTime ||
                  !scriptureUpload.selectedTimeFormat))
            }
            className={`rounded-md py-2 text-sm px-4 ${
              !scriptureUpload.scripture ||
              !scriptureUpload.bibleText ||
              !scriptureUpload.bibleVersion ||
              !scriptureUpload.prayer ||
              (scriptureUpload.selectedOption === "ScheduleForLater" &&
                (!scriptureUpload.selectedDate ||
                  !scriptureUpload.selectedTime ||
                  !scriptureUpload.selectedTimeFormat))
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-primary cursor-pointer"
            }`}
            onClick={() => {
              submitScripture();
            }}
          >
            {scriptureUpload.selectedOption === "ScheduleForLater"
              ? "Schedule"
              : scriptureUpload.selectedOption === "UploadNow"
              ? " Upload"
              : "Save as Drafts"}
          </button>
        </div>
        <div className="rounded-lg p-3 bg-grayBlack mt-6 pb-10">
          {/* Scripture Section   */}
          <div className="flex flex-col gap-2 pt-2">
            <p>Scripture</p>
            <textarea
              className={`${
                isDarkMode ? "bg-off-black" : "bg-off-white"
              } p-2 rounded-md outline-none text-sm placeholder:text-xs resize-none h-20`}
              name="scripture"
              id="scripture"
              placeholder="Type here..."
              value={scriptureUpload.scripture}
              onChange={(e) => {
                setScriptureUpload((prev) => ({
                  ...prev,
                  scripture: e.target.value,
                }));
              }}
            ></textarea>
          </div>
          {/* Prayer Section  */}
          <div className="flex flex-col gap-2 pt-2">
            <p>Prayer</p>
            <textarea
              className={`${
                isDarkMode ? "bg-off-black" : "bg-off-white"
              } p-2 rounded-md outline-none text-sm placeholder:text-xs resize-none h-20`}
              name="prayer"
              id="prayer"
              placeholder="Type here..."
              value={scriptureUpload.prayer}
              onChange={(e) => {
                setScriptureUpload((prev) => ({
                  ...prev,
                  prayer: e.target.value,
                }));
              }}
            ></textarea>
          </div>
          {/* Bible text and bible verion input */}
          <div className="flex justify-between items-center w-full pt-3">
            <div className="flex flex-col gap-2">
              <p>Bible Text</p>
              <input
                className={`${
                  isDarkMode ? "bg-off-black" : "bg-off-white"
                } p-2 rounded-md outline-none text-sm placeholder:text-xs md:w-[400px] `}
                name="bibletext"
                id="bibletext"
                placeholder="Type here..."
                value={scriptureUpload.bibleText}
                onChange={(e) => {
                  setScriptureUpload((prev) => ({
                    ...prev,
                    bibleText: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>Bible Version</p>
              <input
                className={`${
                  isDarkMode ? "bg-off-black" : "bg-off-white"
                } p-2 rounded-md outline-none text-sm placeholder:text-xs md:w-[400px]`}
                name="bibleversion"
                id="bibleversion"
                placeholder="Type here..."
                value={scriptureUpload.bibleVersion}
                onChange={(e) => {
                  setScriptureUpload((prev) => ({
                    ...prev,
                    bibleVersion: e.target.value,
                  }));
                }}
              />
            </div>
          </div>

          {/* Radio Section  to upload status */}
          <div className="flex gap-2 flex-col pt-3">
            <p>Upload Status</p>
            <div className="flex items-center gap-4">
              {radioButtons.map((status) => (
                <label key={status.id} className="flex items-center text-sm">
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={scriptureUpload.selectedOption === status.value}
                    onChange={handleRadioChange}
                    className="form-radio text-purple-600 accent-primary cursor-pointer w-4 h-4 border-2 border-primary rounded-full bg-black"
                  />
                  <span className="ml-2">{status.label}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Scheduling date and Time input field  */}
          {scriptureUpload.selectedOption === "ScheduleForLater" && (
            <div>
              <div className="flex flex-col gap-2 pt-2">
                <p>Date</p>
                <input
                  className={`${
                    isDarkMode ? "bg-off-black" : "bg-off-white"
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs resize-none `}
                  name="selectedDate"
                  id="date"
                  type="date"
                  placeholder="Type here..."
                  value={scriptureUpload.selectedDate}
                  onChange={(e) => {
                    setScriptureUpload((prev) => ({
                      ...prev,
                      selectedDate: e.target.value,
                    }));
                  }}
                />
              </div>
              {/* Scheduling time input field */}
              <div className="flex flex-col gap-2 pt-3">
                <p>Time</p>
                <div className="flex justify-between items-center w-full pt-1">
                  <input
                    className={`${
                      isDarkMode ? "bg-off-black" : "bg-off-white"
                    } p-2 rounded-md outline-none text-sm placeholder:text-xs md:w-[400px] `}
                    name="selectedTime"
                    id="time"
                    type="time"
                    placeholder="Type here..."
                    value={scriptureUpload.selectedTime}
                    onChange={(e) => {
                      setScriptureUpload((prev) => ({
                        ...prev,
                        selectedTime: e.target.value,
                      }));
                    }}
                  />
                  <select
                    className={`${
                      isDarkMode ? "bg-off-black" : "bg-off-white"
                    } p-2 rounded-md outline-none text-sm placeholder:text-xs md:w-[400px]`}
                    // name="bibleversion"
                    // id="bibleversion"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadScriptures;
