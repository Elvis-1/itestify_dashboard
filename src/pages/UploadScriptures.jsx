import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";
import SuccessModal from "../component/DailyScripturePopups/SuccessModal";
import { ScriptureContext } from "../context/ScriptureContext";
import WarningModal from "../component/DailyScripturePopups/WarningModal";

const UploadScriptures = () => {
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
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningScheduledModal, setIsWarningScheduledModal] = useState(false);
  const [isWarningUploadModal, setIsWarningUploadModal] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!scriptureUpload.selectedOption) {
      setScriptureUpload((prev) => ({
        ...prev,
        selectedOption: "UploadNow",
      }));
    }
  }, [setScriptureUpload]);

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
      selectedOption: "UploadNow",
      selectedDate: "",
      selectedTime: "",
      selectedTimeFormat: "",
    });
  };

  const checkForExistingSchedule = () => {
    if (scriptureUpload.selectedOption !== "ScheduleForLater") return false;
    const selectedDate = scriptureUpload.selectedDate;
    return scriptureUploadedDetails.some(
      (item) =>
        item.status === "scheduled" && item.selectedDate === selectedDate
    );
  };
  const checkForExistingUpload = () => {
    if (scriptureUpload.selectedOption !== "UploadNow") return false;
    return scriptureUploadedDetails.some(
      (item) =>
        item.status === "uploaded" &&
        item.uploadedDate === new Date().toLocaleDateString()
    );
  };
  const checkForExistingScheduleToUpload = () => {
    if (scriptureUpload.selectedOption !== "ScheduleForLater") return false;
    // const selectedDate = scriptureUpload.selectedDate;
    return scriptureUploadedDetails.some(
      (item) =>
        item.status === "scheduled" && item.selectedDate === item.uploadedDate
    );
  };

  const submitScripture = (replace = false) => {
    const newScripture = {
      id: replace
        ? scriptureUploadedDetails.find(
            (item) =>
              item.status === "scheduled" &&
              item.selectedDate === scriptureUpload.selectedDate
          )?.id || scriptureUploadedDetails.length + 1
        : scriptureUploadedDetails.length + 1,
      dateUploaded:
        scriptureUpload.selectedOption === "UploadNow"
          ? new Date().toLocaleDateString()
          : "---",
      selectedDate:
        scriptureUpload.selectedOption === "ScheduleForLater"
          ? scriptureUpload.selectedDate
          : "---",
      selectedTime:
        scriptureUpload.selectedOption === "ScheduleForLater"
          ? scriptureUpload.selectedTime
          : "---",
      selectedTimeFormat:
        scriptureUpload.selectedOption === "ScheduleForLater"
          ? scriptureUpload.selectedTimeFormat
          : "---",
      bibleText: scriptureUpload.bibleText,
      scripture: scriptureUpload.scripture,
      bibleVersion: scriptureUpload.bibleVersion,
      prayer: scriptureUpload.prayer,
      status:
        scriptureUpload.selectedOption === "UploadNow"
          ? "uploaded"
          : "scheduled",
    };

    if (replace) {
      // Replace the existing scheduled scripture
      setScriptureUploadedDetails((prev) =>
        prev.map((item) =>
          item.status === "scheduled" &&
          item.selectedDate === scriptureUpload.selectedDate
            ? newScripture
            : item
        )
      );
    } else {
      // Add new scripture
      setScriptureUploadedDetails((prev) => [...prev, newScripture]);
    }
    setSuccessMessage(
      scriptureUpload.selectedOption === "UploadNow"
        ? "Scripture Uploaded Successfully"
        : "Scripture Scheduled Successfully"
    );
    setIsSuccessModal(true);
  };

  const handleSubmit = () => {
    if (checkForExistingSchedule() || checkForExistingUpload()) {
      setIsWarningScheduledModal(true);
    } else if (!checkForExistingScheduleToUpload) {
      setIsWarningUploadModal(true);
    } else {
      submitScripture();
      resetForm();
    }
  };

  const handleReplaceSchedule = () => {
    submitScripture(true); // Replace existing scripture
    setIsWarningScheduledModal(false);
    resetForm();
  };

  const handleCancelSchedule = () => {
    setIsWarningScheduledModal(false); // Close warning modal without action
  };
  const handleCancelUpload = () => {
    setIsWarningUploadModal(false); // Close warning modal without action
  };
  const handleSubmitUpload = () => {
    submitScripture(); // Upload scripture immediately
    setIsWarningUploadModal(false);
    resetForm();
  };
  const isButtonDisabled =
    !scriptureUpload.scripture ||
    !scriptureUpload.bibleText ||
    !scriptureUpload.bibleVersion ||
    !scriptureUpload.prayer ||
    (scriptureUpload.selectedOption === "ScheduleForLater" &&
      (!scriptureUpload.selectedDate ||
        !scriptureUpload.selectedTime ||
        !scriptureUpload.selectedTimeFormat));

  return (
    <div className={`${isDarkMode ? "bg-black" : "bg-off-white"}`}>
      {isSuccessModal && <SuccessModal successMessage={successMessage} />}
      {isWarningScheduledModal && (
        <WarningModal
          title={` Scripture Has been Scheduled for this date`}
          message={`You already have a scheduled scripture for this date. Do you want to replace it with this one?`}
          onCancel={handleCancelSchedule}
          onReplace={handleReplaceSchedule}
          buttonText="Replace it"
        />
      )}
      {isWarningUploadModal && (
        <WarningModal
          title={`Scripture Has been Posted for Today`}
          message={`A scripture was already posted earlier today. Do you want to replace it with this new one? This change will be visible to all users immediately`}
          onCancel={handleCancelUpload}
          onReplace={handleSubmitUpload}
          buttonText="Upload it"
        />
      )}
      <div className={`p-5 ${isDarkMode ? "bg-black" : "bg-off-white"}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Upload New Scriptures</h2>
          <button
            disabled={isButtonDisabled}
            className={`rounded-md py-2 text-sm px-4 ${
              isButtonDisabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-primary cursor-pointer"
            }`}
            onClick={handleSubmit}
          >
            {scriptureUpload.selectedOption === "ScheduleForLater"
              ? "Schedule"
              : "Upload"}
          </button>
        </div>
        <div
          className={`rounded-lg p-3 ${
            isDarkMode ? "bg-grayBlack" : "bg-white"
          } mt-6 pb-6`}
        >
          {/* Scripture Section */}
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
              onChange={(e) =>
                setScriptureUpload((prev) => ({
                  ...prev,
                  scripture: e.target.value,
                }))
              }
            ></textarea>
          </div>
          {/* Prayer Section */}
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
              onChange={(e) =>
                setScriptureUpload((prev) => ({
                  ...prev,
                  prayer: e.target.value,
                }))
              }
            ></textarea>
          </div>
          {/* Bible text and bible version input */}
          <div className="flex justify-between items-center w-full pt-3">
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

          {/* Radio Section to upload status */}
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
                    onChange={(e) => {
                      setScriptureUpload((prev) => ({
                        ...prev,
                        selectedOption: e.target.value,
                      }));
                    }}
                    className="form-radio text-purple-600 accent-primary cursor-pointer w-4 h-4 border-2 border-primary rounded-full bg-black"
                  />
                  <span className="ml-2">{status.label}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Scheduling date and Time input field */}
          {scriptureUpload.selectedOption === "ScheduleForLater" && (
            <div>
              <div className="flex flex-col gap-2 pt-2">
                <p>Date</p>
                <input
                  className={`${
                    isDarkMode ? "bg-off-black" : "bg-off-white"
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs resize-none`}
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
              {/* Scheduling time input field */}
              <div className="flex flex-col gap-2 pt-3">
                <p>Time</p>
                <div className="flex justify-between items-center w-full pt-1">
                  <input
                    className={`${
                      isDarkMode ? "bg-off-black" : "bg-off-white"
                    } p-2 rounded-md outline-none text-sm placeholder:text-xs md:w-[400px]`}
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
                  <select
                    className={`${
                      isDarkMode ? "bg-off-black" : "bg-off-white"
                    } p-2 rounded-md outline-none text-sm placeholder:text-xs md:w-[400px]`}
                    value={scriptureUpload.selectedTimeFormat}
                    onChange={(e) =>
                      setScriptureUpload((prev) => ({
                        ...prev,
                        selectedTimeFormat: e.target.value,
                      }))
                    }
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
