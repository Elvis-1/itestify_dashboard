import React, { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { MdClose } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { ScriptureContext } from "../../context/ScriptureContext";

const EditScripture = ({ setEditModal, scriptureId, setSuccessEditModal }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const { scriptureUploadedDetails, editScripture } =
    useContext(ScriptureContext);
  const initialScripture =
    scriptureUploadedDetails.find((s) => s.id === scriptureId) || {};
  const options = [
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [formData, setFormData] = useState({
    scripture: initialScripture.scripture || "",
    prayer: initialScripture.prayer || "",
    bibleText: initialScripture.bibleText || "",
    bibleVersion: initialScripture.bibleVersion || "",
    selectedDate: initialScripture.selectedDate || "",
    selectedTime: initialScripture.selectedTime || "",
    selectedTimeFormat: initialScripture.selectedTimeFormat || "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    // Clean the data (remove empty or undefined fields)
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );
    // Update the scripture
    editScripture(scriptureId, cleanedData);
    setEditModal(false);
    setSuccessEditModal(true);
  };

  const findScheduled = initialScripture.status === "scheduled" 
  return (
    <div>
      <div className="fixed inset-0 z-50 ">
        {/* Non-clickable overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50`}
          aria-hidden="true"
        />

        {/* Modal */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md shadow-2xl overflow-y-auto max-h-[80vh] sidebar-container mt-12 ">
          <div
            className={`rounded-lg modal ${
              isDarkMode ? "bg-near-black text-white" : "bg-white text-black"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between w-full border-b border-gray-300 p-2">
              <h1 className="text-lg">Edit Scripture</h1>
              <button
                className="cursor-pointer"
                aria-label="Close Modal"
                onClick={() => setEditModal(false)}
              >
                <MdClose />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Scripture details Input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="scripture">
                  Scripture
                </label>
                <textarea
                  type="text"
                  value={formData.scripture}
                  name="scripture"
                  onChange={handleChange}
                  className={`${
                    isDarkMode ? `bg-off-black` : `bg-off-white`
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs resize-none`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="prayer">
                  Prayer
                </label>
                <textarea
                  type="text"
                  name="prayer"
                  value={formData.prayer}
                  onChange={handleChange}
                  className={`${
                    isDarkMode ? `bg-off-black` : `bg-off-white`
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs resize-none`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="bibleText">
                  Bible Text
                </label>
                <input
                  type="text"
                  name="bibleText"
                  value={formData.bibleText}
                  onChange={handleChange}
                  className={`${
                    isDarkMode ? `bg-off-black` : `bg-off-white`
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="bibleText">
                  Bible Version
                </label>
                <input
                  type="text"
                  name="bibleVersion"
                  value={formData.bibleVersion}
                  onChange={handleChange}
                  className={`${
                    isDarkMode ? `bg-off-black` : `bg-off-white`
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs`}
                />
              </div>
            </div>
            {findScheduled && (
              <div className="p-3 border-b-[1px] border-b-off-white">
                <div className="flex flex-col gap-2">
                  <label htmlFor="scheduled-date">Scheduled date</label>
                  <input
                    className={`${
                      isDarkMode ? "bg-off-black" : "bg-off-white"
                    } p-2 rounded-md outline-none text-sm placeholder:text-xs`}
                    type="date"
                    id="from"
                    value={formData.selectedDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p className="text-sm pt-3">Scheduled Time</p>
                  <div className="flex justify-between items-center gap-6 pt-2">
                    <input
                      className={`${
                        isDarkMode ? "bg-off-black" : "bg-off-white"
                      } p-2 rounded-md outline-none text-sm placeholder:text-xs md:w-[200px] `}
                      name="selectedTime"
                      id="time"
                      type="time"
                      placeholder="Type here..."
                      value={formData.selectedTime}
                      onChange={handleChange}
                    />
                    <div className="flex flex-col gap-2">
                      {/* Dropdown  */}
                      <button
                        onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                        className={`w-[200px] p-2 ${
                          isDarkMode
                            ? `bg-off-black hover:bg-zinc-800`
                            : `bg-off-white hover:bg-near-white`
                        } flex items-center justify-between
                   p-1 rounded-md outline-none text-sm placeholder:text-xs
                   transition-colors duration-200`}
                      >
                        <span className="text-sm opacity-80">
                          {formData.selectedTimeFormat
                            ? options.find(
                                (opt) =>
                                  opt.value === formData.selectedTimeFormat
                              )?.label
                            : ""}
                        </span>
                        <IoMdArrowDropdown
                          className={`w-5 h-5 transition-transform duration-200 
                    ${isOpenDropdown ? "transform rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    {isOpenDropdown && (
                      <div
                        className={`absolute right-2 bottom-0 w-[200px] mt-1  rounded-lg border border-off-white outline-none text-sm placeholder:text-xs overflow-hidden  ${
                          isDarkMode ? `bg-black` : `bg-off-white`
                        }`}
                      >
                        {options.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                selectedTimeFormat: option.value,
                              }));
                              setIsOpenDropdown(false);
                            }}
                            className={`p-2 cursor-pointer ${
                              isDarkMode
                                ? `text-white hover:bg-zinc-800 border-b-off-white`
                                : `text-black hover:bg-near-white border-b-borderColor`
                            } text-sm
                         transition-colors duration-150 border-b`}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className={`flex items-center gap-3 p-4 justify-end`}>
              <button
                onClick={() => setEditModal(false)}
                className={`btn-secondary px-6 py-3 text-xs text-primary border-primary ${
                  isDarkMode ? `` : ` border-near-black `
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                type="submit"
                className="btn-primary px-3 py-3 text-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditScripture;
