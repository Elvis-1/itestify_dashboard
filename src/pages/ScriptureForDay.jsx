import React, { useContext, useState, useMemo } from "react";
import { IoAdd } from "react-icons/io5";
import { RiFilter3Line } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import { DarkModeContext } from "../context/DarkModeContext";
import AllScriptures from "../component/scriptureStatus/AllScriptures";
import UploadedScriptures from "../component/scriptureStatus/UploadedScriptures";
import ScheduledScriptures from "../component/scriptureStatus/ScheduledScriptures";
import DraftScriptures from "../component/scriptureStatus/DraftScriptures";
import { ScriptureProvider } from "../context/ScriptureContext";

const ScriptureForDay = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { scriptures } = useContext(ScriptureProvider);
  const [Status, setStatus] = useState("All");
  const [searchItem, setSearchItem] = useState("");
  const scriptureStatus = [
    { status: "All" },
    { status: "Uploaded" },
    { status: "Scheduled" },
    { status: "Draft" },
  ];

  const allScriptures = useMemo(() => {
    return scriptures.filter(
      (item) =>
        searchItem === "" ||
        item.bibleVersion?.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.scripture?.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.prayer?.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.bibleText?.toLowerCase().includes(searchItem.toLowerCase())
    );
  }, [searchItem, scriptures]);
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchItem(searchValue);
    console.log(allScriptures);
  };

  return (
    <div className={`${isDarkMode ? `bg-black` : `bg-off-white`}`}>
      <div className={`p-5 ${isDarkMode ? `bg-black` : `bg-off-white`}`}>
        <button className="flex justify-end gap-1 p-2 rounded-md bg-primary cursor-pointer ml-auto">
          <IoAdd fill="#ffffff" />
          <span className="text-white text-xs">Upload New Scripture</span>
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
                        ? "border-b-primary text-white"
                        : "border-b-transparent text-off-white"
                    } hover:border-b-primary`}
                  >
                    {status.status}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {/*---------------------------------------- Search Bar  ---------------------------------*/}
              <div
                className={`flex justify-left items-center gap-2 p-3 rounded-lg w-[300px] ${
                  isDarkMode ? `bg-off-black` : `bg-off-white`
                }`}
              >
                <SearchOutlined
                  style={{
                    fill: isDarkMode ? "white" : "black",
                    fontSize: "16px",
                  }}
                />
                <input
                  className="border-none outline-none bg-transparent w-[200px] text-xs placeholder:text-xs"
                  type="text"
                  name="search"
                  id="search-user"
                  placeholder="Search by version, scripture, prayer..."
                  value={searchItem}
                  onChange={handleSearch}
                />
              </div>
              <div
                //   onClick={showFilterModal}
                className="flex justify-center items-center gap-1 p-2 rounded-md border-2 border-primary cursor-pointer "
              >
                <i>
                  <RiFilter3Line fill="#9966cc" />
                </i>
                <p className=" text-primary text-sm">Filter</p>
              </div>
            </div>
          </div>
          {Status === "All" && (
            <AllScriptures
              scriptures={scriptures}
              allScriptures={allScriptures}
            />
          )}
          {Status === "Uploaded" && (
            <UploadedScriptures scriptures={scriptures} />
          )}
          {Status === "Scheduled" && <ScheduledScriptures />}
          {Status === "Draft" && <DraftScriptures />}
        </div>
      </div>
    </div>
  );
};

export default ScriptureForDay;
