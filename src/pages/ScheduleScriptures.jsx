import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";
import SuccessModal from "../component/DailyScripturePopups/SuccessModal";
import { ScriptureContext } from "../context/ScriptureContext";
import WarningModal from "../component/DailyScripturePopups/WarningModal";
import { MdClose } from "react-icons/md";
import { RiDropdownList } from "react-icons/ri";
import { IoIosArrowDropdown, IoMdArrowDropdown } from "react-icons/io";
import { LuPlus } from "react-icons/lu";

const ScheduleScriptures = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const {
    scriptureUpload,
    setScriptureUpload,
    scriptureUploadedDetails,
    setScriptureUploadedDetails,
  } = useContext(ScriptureContext);
  const radioButtons = [
    { id: 1, label: "Upload now", value: "UploadNow" },
    { id: 2, label: "Schedule for later", value: "ScheduleForLater" },
  ];
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [openScriptureSection, setOpenScriptureSection] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccessModal) {
      const timeout = setTimeout(() => {
        setIsSuccessModal(false);
        navigate("/dashboard/daily-scripture");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isSuccessModal, navigate]);

  const resetForm = () => {
    setScriptureUpload({
      scripture: "",
      prayer: "",
      bibleText: "",
      bibleVersion: "",
      selectedDate: "",
      selectedTime: "",
      selectedTimeFormat: "",
    });
  };

  const submitScripture = () => {
    const newScripture = {
      id: scriptureUploadedDetails.length + 1,
      dateUploaded: new Date().toLocaleDateString(),
      selectedDate: scriptureUpload.selectedDate,
      selectedTime: scriptureUpload.selectedTime,
      selectedTimeFormat: scriptureUpload.selectedTimeFormat,
      bibleText: scriptureUpload.bibleText,
      scripture: scriptureUpload.scripture,
      bibleVersion: scriptureUpload.bibleVersion,
      prayer: scriptureUpload.prayer,
      status: "scheduled",
    };
    // Add new scripture
    setScriptureUploadedDetails((prev) => [...prev, newScripture]);

    setIsSuccessModal(true);
  };

  const handleSubmit = () => {
    submitScripture();
    resetForm();
  };
  const isButtonDisabled =
    !scriptureUpload.bibleText ||
    !scriptureUpload.bibleVersion ||
    !scriptureUpload.prayer;

  return (
    <div className={`${isDarkMode ? "bg-black" : "bg-off-white"}`}>
      {isSuccessModal && (
        <SuccessModal successMessage="Scripture schedule successfully saved!" />
      )}

      <div className={`p-5 ${isDarkMode ? "bg-black" : "bg-off-white"}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Schedule Scriptures</h2>
          <button
            disabled={isButtonDisabled}
            className={`rounded-md py-2 text-sm px-4 ${
              isButtonDisabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-primary cursor-pointer"
            }`}
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
        <div
          className={`rounded-lg p-3 ${
            isDarkMode ? "bg-near-black" : "bg-off-white"
          } mt-6 pb-6`}
        >
          <div className="bg-grayBlack rounded-2xl p-4 pb-6">
            <div className="flex items-center gap-1 text-xs bg-off-black rounded-lg p-2 ml-auto text-right justify-end w-fit mt-2">
              <p>0 Added</p>
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <p>maximum 20 scriptures at a time</p>
            </div>
            <div className=" border border-borderColor rounded-lg mt-6 pb-4">
              <div
                className={`flex items-center w-full justify-between border-b ${
                  openScriptureSection
                    ? `border-b-borderColor`
                    : `border-none pb-0`
                }  p-3`}
              >
                <p>Scripture 1</p>
                <div className="flex gap-3">
                  <i>
                    <MdClose
                      className="border border-border-gray rounded-md p-1 w-6 h-6 cursor-pointer "
                      fontSize={20}
                    />
                  </i>
                  <i>
                    <IoMdArrowDropdown
                      className="border border-border-borderColor rounded-md  cursor-pointer p-1 w-6 h-6"
                      fontSize={20}
                      onClick={() =>
                        setOpenScriptureSection(!openScriptureSection)
                      }
                    />
                  </i>
                </div>
              </div>
              {openScriptureSection && (
                <div>
                  {/* Bible text and bible version input */}
                  <div className="flex justify-between items-center w-full pt-2 px-3">
                    <div className="flex flex-col gap-2">
                      <p>Bible Text</p>
                      <input
                        className={`${
                          isDarkMode ? "bg-off-black" : "bg-off-white"
                        } p-2 rounded-md outline-none text-sm placeholder:text-xs md:w-[400px]`}
                        name="bibleText"
                        id="bibleText"
                        placeholder="Type here..."
                        value={scriptureUpload.bibleText}
                        onChange={(e) =>
                          setScriptureUpload((prev) => ({
                            ...prev,
                            bibleText: e.target.value,
                          }))
                        }
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
                        onChange={(e) =>
                          setScriptureUpload((prev) => ({
                            ...prev,
                            bibleVersion: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  {/* Prayer Section */}
                  <div className="flex flex-col gap-2 pt-3 px-3">
                    <p>Prayer</p>
                    <textarea
                      className={`${
                        isDarkMode ? "bg-off-black" : "bg-off-white"
                      } p-2 rounded-md outline-none text-sm placeholder:text-xs resize-none h-20`}
                      name="prayer"
                      id="prayer"
                      placeholder="Type here..."
                      value={scriptureUpload.prayer}
                      onChange={(e) =>
                        setScriptureUpload((prev) => ({
                          ...prev,
                          prayer: e.target.value,
                        }))
                      }
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
            <button className="flex items-center gap-1 border border-primary rounded-lg text-primary p-2 text-xs mt-4">
              <LuPlus />
              Add New
            </button>
          </div>

          {/* Scheduling date and Time Settings */}
          <div className="bg-grayBlack rounded-2xl mt-6 px-4 pb-12 pt-3">
            <h1 className="py-3">Schedule Settings</h1>
            <div className="flex justify-between items-start align-top gap-6 w-full pt-4">
              <div className="flex flex-col gap-2 w-full">
                <p>From</p>
                <input
                  className={`${
                    isDarkMode ? "bg-off-black" : "bg-off-white"
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs w-full`}
                  name="selectedDate"
                  id="date"
                  type="date"
                  placeholder="Type here..."
                  value={scriptureUpload.selectedDate}
                  onChange={(e) =>
                    setScriptureUpload((prev) => ({
                      ...prev,
                      selectedDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <p>To</p>
                <input
                  className={`${
                    isDarkMode ? "bg-off-black" : "bg-off-white"
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs w-full`}
                  name="selectedDate"
                  id="date"
                  type="date"
                  placeholder="Type here..."
                  value={scriptureUpload.selectedDate}
                  onChange={(e) =>
                    setScriptureUpload((prev) => ({
                      ...prev,
                      selectedDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <p>Time</p>
                <input
                  className={`${
                    isDarkMode ? "bg-off-black" : "bg-off-white"
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs w-full`}
                  name="selectedTime"
                  id="time"
                  type="time"
                  placeholder="Type here..."
                  value={scriptureUpload.selectedTime}
                  onChange={(e) =>
                    setScriptureUpload((prev) => ({
                      ...prev,
                      selectedTime: e.target.value,
                    }))
                  }
                />
                <p className="text-xs text-near-white">
                  Scriptures will be posted Daily at this time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleScriptures;
