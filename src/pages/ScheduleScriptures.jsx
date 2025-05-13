import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";
import SuccessModal from "../component/DailyScripturePopups/SuccessModal";
import { ScriptureContext } from "../context/ScriptureContext";
import { MdClose } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { LuPlus } from "react-icons/lu";

const ScheduleScriptures = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const {
    scriptureUpload,
    setScriptureUpload,
    scriptureUploadedDetails,
    setScriptureUploadedDetails,
  } = useContext(ScriptureContext);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [openScriptureSection, setOpenScriptureSection] = useState(false);
  const [scriptureInputs, setScriptureInputs] = useState([
    { bibleVerse: "", bibleVersion: "", prayer: "" },
  ]);

  const [bibleVerses, setBibleVerses] = useState([]);
  const [bibleVersions, setBibleVersions] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (index, event) => {
    const updatedInputs = [...scriptureInputs];
    updatedInputs[index][event.target.name] = event.target.value;
    setScriptureInputs(updatedInputs);
  };

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
    setScriptureInputs([{ bibleText: "", bibleVersion: "", prayer: "" }]);
  };
  
  const submitScripture = () => {
    const newEntries = scriptureInputs.map((entry, index) => ({
      id: scriptureUploadedDetails.length + index + 1,
      dateUploaded: new Date().toLocaleDateString(),
      selectedDate: scriptureUpload.selectedDate,
      selectedTime: scriptureUpload.selectedTime,
      selectedTimeFormat: scriptureUpload.selectedTimeFormat,
      bibleVerse: entry.bibleVerse,
      bibleVersion: entry.bibleVersion,
      prayer: entry.prayer,
      status: "scheduled",
    }));

    setScriptureUploadedDetails((prev) => [...prev, ...newEntries]);
    setIsSuccessModal(true);
  };

  const addNewScriptureField = () => {
    if (scriptureInputs.length < 20) {
      setScriptureInputs((prev) => [
        ...prev,
        { bibleVerse: "", bibleVersion: "", prayer: "" },
      ]);
    }
  };

  const removeScriptureField = (index) => {
    if (scriptureInputs.length > 0) {
      const updatedInputs = [...scriptureInputs];
      updatedInputs.splice(index, 1);
      setScriptureInputs(updatedInputs);
    }
  };

  const handleSubmit = () => {
    submitScripture();
    resetForm();
  };
  const isButtonDisabled = scriptureInputs.some(
    (input) => !input.bibleVerse || !input.bibleVersion || !input.prayer
  );
  
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
            } ${isDarkMode ? `` : `text-white`}`}
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
          <div
            className={`${
              isDarkMode ? `bg-grayBlack` : `bg-white`
            } rounded-2xl p-4 pb-6`}
          >
            <div
              className={`flex items-center gap-1 text-xs ${
                isDarkMode ? `bg-off-black` : `bg-off-white`
              } rounded-lg p-2 ml-auto text-right justify-end w-fit mt-2`}
            >
              <p>{scriptureInputs.length} Added</p>
              <div
                className={`w-2 h-2 rounded-full ${
                  isDarkMode ? `bg-white` : `bg-black`
                }`}
              ></div>
              <p>maximum 20 scriptures at a time</p>
            </div>
            {scriptureInputs.map((input, index) => (
              <div
                className=" border border-borderColor rounded-lg mt-6 pb-4"
                key={index}
              >
                {/* Bible Verse and Bible Version Section */}
                <div
                  className={`flex items-center w-full justify-between border-b ${
                    openScriptureSection
                      ? `border-b-borderColor`
                      : `border-none pb-0`
                  }  p-3`}
                >
                  <p>Scripture {index + 1}</p>
                  <div className="flex gap-3">
                    <i>
                      <MdClose
                        className="border border-border-gray rounded-md p-1 w-6 h-6 cursor-pointer "
                        fontSize={20}
                        onClick={() => removeScriptureField(index)}
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
                        <p>Bible Verse</p>
                        <input
                          className={`${
                            isDarkMode ? "bg-off-black" : "bg-off-white"
                          } p-2 rounded-md outline-none text-sm placeholder:text-xs md:w-[400px]`}
                          name="bibleVerse"
                          id="bibleVerse"
                          placeholder="Type here..."
                          value={input.bibleVerse}
                          onChange={(e) => handleInputChange(index, e)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p>Bible Version</p>
                        <input
                          className={`${
                            isDarkMode ? "bg-off-black" : "bg-off-white"
                          } p-2 rounded-md outline-none text-sm placeholder:text-xs md:w-[400px]`}
                          name="bibleVersion"
                          id="bibleversion"
                          placeholder="Type here..."
                          value={input.bibleVersion}
                          onChange={(e) => handleInputChange(index, e)}
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
                        value={input.prayer}
                        onChange={(e) => handleInputChange(index, e)}
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              className="flex items-center gap-1 border border-primary rounded-lg text-primary p-2 text-xs mt-4"
              onClick={addNewScriptureField}
            >
              <LuPlus />
              Add New
            </button>
          </div>

          {/* Scheduling date and Time Settings */}
          <div
            className={` ${
              isDarkMode ? `bg-grayBlack` : `bg-white`
            } rounded-2xl mt-6 px-4 pb-12 pt-3`}
          >
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
