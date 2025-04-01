import React, { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { MdClose } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
const EditUploadedScripture = ({ editModal, setEditModal }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const options = [
    { value: "KJV", label: "KJV" },
    { value: "NIV", label: "NIV" },
    // { value: "ESV", label: "ESV" },
    // { value: "MSG", label: "MSG" },
    // { value: "NKJV", label: "NKJV" },
  ];
  const [scriptureDetails, setScriptureDetails] = useState({
    scripture: "",
    prayer: "",
    bibleText: "",
    bibleVersion: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setScriptureDetails({ ...scriptureDetails, [name]: value });
    console.log(scriptureDetails);
  };

  return (
    <div>
      {" "}
      <div className="fixed inset-0 z-50 ">
        {/* Non-clickable overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50`}
          aria-hidden="true"
        />

        {/* Modal */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md shadow-2xl overflow-y-auto max-h-screen sidebar-container mt-12 ">
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
                  value={scriptureDetails.scripture}
                  name="scripture"
                  // onChange={handleChange}
                  className={`${
                    isDarkMode ? `bg-off-black` : `bg-off-white`
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="prayer">
                  Prayer
                </label>
                <textarea
                  type="text"
                  name="prayer"
                  value={scriptureDetails.prayer}
                  // onChange={handleChange}
                  className={`${
                    isDarkMode ? `bg-off-black` : `bg-off-white`
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="bibleText">
                  Bible Text
                </label>
                <textarea
                  type="text"
                  name="bibleText"
                  value={scriptureDetails.bibleText}
                  // onChange={handleChange}
                  className={`${
                    isDarkMode ? `bg-off-black` : `bg-off-white`
                  } p-2 rounded-md outline-none text-sm placeholder:text-xs`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="bibleText">
                  Bible Version
                </label>

                {/* Dropdown  */}
                <button
                  onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                  className={`w-full p-2 ${
                    isDarkMode
                      ? `bg-off-black hover:bg-zinc-800`
                      : `bg-off-white hover:bg-near-white`
                  } flex items-center justify-between
                   p-1 rounded-md outline-none text-sm placeholder:text-xs
                   transition-colors duration-200`}
                >
                  <span className="text-sm opacity-80">
                    {scriptureDetails.bibleVersion
                      ? options.find(
                          (opt) => opt.value === scriptureDetails.bibleVersion
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
                  className={`absolute w-[350px] mt-1  rounded-lg border border-off-white outline-none text-sm placeholder:text-xs overflow-hidden  ${
                    isDarkMode ? `bg-black` : `bg-off-white`
                  }`}
                >
                  {options.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setScriptureDetails((prev) => ({
                          ...prev,
                          bibleVersion: option.value,
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
            <div className="p-3 border-b-[1px] border-b-off-white">
              <div  className="flex flex-col gap-2">
              <label htmlFor="scheduled-date">Scheduled date</label>
              <input
                    className={`${
                      isDarkMode ? "bg-off-black" : "bg-off-white"
                    } p-2 rounded-md outline-none text-sm placeholder:text-xs`}
                    type="date"
                    id="from"
                    // value={dateRange.from}
                    // onChange={(e) => handleDateChange(e, "from")}
                  />
              </div>
              <div className="flex justify-between gap-6 pt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-400" htmlFor="from">
                    From
                  </label>
                  <input
                    className={`${
                      isDarkMode ? "bg-off-black" : "bg-off-white"
                    } p-2 rounded-md outline-none text-sm placeholder:text-xs w-full`}
                    type="time"
                    id="from"
                    // value={dateRange.from}
                    // onChange={(e) => handleDateChange(e, "from")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-400" htmlFor="to">
                    Scheduled Time
                  </label>
                  <input
                    className={`${
                      isDarkMode ? "bg-off-black" : "bg-off-white"
                    } p-2 rounded-md outline-none text-sm placeholder:text-xs`}
                    type="date"
                    id="to"
                    // value={dateRange.to}
                    // onChange={(e) => handleDateChange(e, "to")}
                  />
                </div>
              </div>
            </div>

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
                // onClick={
                //   adminDetails.role !== "Super admin" ? onProceed : onConfirm
                // }
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

export default EditUploadedScripture;
