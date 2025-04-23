import React, { useContext, useState, useEffect, useRef, useMemo } from "react";
import NoDataComponent from "../NoDataComponent";
import { DarkModeContext } from "../../context/DarkModeContext";
import { LuChevronsUpDown } from "react-icons/lu";
import { MdOutlineMoreHoriz } from "react-icons/md";
import useSort from "../../hooks/useSort";
import usePagination from "../../hooks/usePagination";
import Pagination from "../Pagination";
import { ScriptureContext } from "../../context/ScriptureContext";
import { RiFilter3Line } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import FilterScriptures from "../DailyScripturePopups/FilterScriptures";
const AllScriptures = ({ scriptures, setScriptures }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isOpenOptions, setIsOpenOptions] = useState(-1);
  const [searchItem, setSearchItem] = useState("");
  const [isFilter, setIsFilter] = useState(false);
  const toggleOptions = (index) => {
    setIsOpenOptions(isOpenOptions === index ? null : index);
  };
  const tableHeaders = [
    {
      key: "serialno",
      Label: "S/N",
    },
    {
      key: "dateUploaded",
      Label: "Date Uploaded",
    },
    {
      key: "bibleText",
      Label: "Bible Text",
    },
    {
      key: "scripture",
      Label: "Scripture",
    },
    {
      key: "bibleVer",
      Label: "Bible Version",
    },
    {
      key: "prayer",
      Label: "Prayer",
    },
    {
      key: "status",
      Label: "Status",
    },
    // {
    //   key: "action",
    //   Label: "Action",
    // },
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
  const { sort, sortHeader, sortedData } = useSort(allScriptures);
  const { currentPage, setCurrentPage, firstIndex, lastIndex, users, npage } =
    usePagination(sortedData);
  // close options with click outside
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchItem(searchValue);
    console.log(allScriptures);
  };
  const [filters, setFilters] = useState({
    selectedOption: null,
    dateRange: { from: "", to: "" },
  });

  return (
    <div className="relative">
      {isFilter && (
        <FilterScriptures
          setScriptures={setScriptures}
          allScriptures={allScriptures}
          setIsFilter={setIsFilter}
          filters={filters}
          setFilters={setFilters}
          onFilterChange={(filtered) => console.log("Filtered:", filtered)}
        />
      )}
      <div
        className={`h-[22rem] pb-6 rounded-b-lg ${
          isDarkMode ? `bg-lightBlack dark-mode` : `light-mode`
        } `}
      >
        <div className="absolute -top-16 right-6 flex items-center gap-4">
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
            onClick={() => {
              setIsFilter(true);
            }}
            className="flex justify-center items-center gap-1 p-2 rounded-md border-2 border-primary cursor-pointer "
          >
            <i>
              <RiFilter3Line fill="#9966cc" />
            </i>
            <p className=" text-primary text-sm">Filter</p>
          </div>
        </div>
        <table
          className={`custom-table  font-sans text-[14px] ${
            isDarkMode ? `bg-lightBlack dark-mode` : `light-mode`
          } `}
        >
          <thead
            className={` text-xs ${
              isDarkMode ? `bg-near-black` : `bg-off-white text-black`
            }`}
          >
            <tr
              className={` ${
                isDarkMode
                  ? `bg-off-black text-white hover:bg-[#313131]`
                  : `bg-white text-black hover:bg-off-white`
              }`}
            >
              {tableHeaders.map((header, index) => (
                <th
                  className={`cursor-pointer text-[10px] ${
                    isDarkMode
                      ? `bg-off-black text-white`
                      : `bg-off-white text-black`
                  }`}
                  onClick={() => {
                    sortHeader({ key: header.key }), console.log(header.key);
                  }}
                  key={index}
                >
                  <div className="flex items-center gap-1 ">
                    {header.Label}
                    <i>
                      <LuChevronsUpDown
                        direction={
                          sort.keyToSort === header.key
                            ? sort.direction
                            : "ascending"
                        }
                      />
                    </i>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {allScriptures.length > 0 ? (
            users.map((data) => (
              <tbody className="relative text-xs" key={data.id}>
                <tr
                  className={` ${
                    isDarkMode
                      ? `hover:bg-off-black`
                      : `hover:bg-off-white text-black`
                  }`}
                >
                  <td>{data.id}</td>
                  <td>
                    {data.status === "uploaded" ? data.dateUploaded : "---"}
                  </td>
                  <td>{data.bibleText}</td>
                  <td>{data.scripture.substr(0, 20)}...</td>
                  <td>{data.bibleVersion}</td>
                  <td>{data.prayer.substr(0, 20)}...</td>
                  <td>
                    <button
                      className={`border py-2 px-4 rounded-lg min-w-24 ${
                        data.status === "scheduled"
                          ? `border-yellow-500 text-yellow-500 `
                          : data.status === "uploaded"
                          ? `border-green-500 text-green-500 `
                          : `border-white text-white `
                      }`}
                    >
                      {data.status}
                    </button>
                  </td>
                  {/* <td>
                    {isOpenOptions === data.id && (
                      <div
                        className={`rounded-lg ${
                          isDarkMode
                            ? `text-white bg-[#292929] border-white`
                            : `text-black bg-white border-borderColor`
                        } w-[120px] border absolute top-10 right-10 z-30 shadow-lg`}
                      >
                        <p
                          // onClick={() => {
                          //   openProfileModal(data.id);
                          // }}
                          className=" border-b-[1px] border-gray-200 p-2 cursor-pointer"
                        >
                          View
                        </p>
                        <p
                          // onClick={() => {
                          //   openProfileModal(data.id);
                          // }}
                          className="border-b-[1px] border-gray-200 p-2 cursor-pointer"
                        >
                          Edit
                        </p>
                        <p
                          // onClick={() => {
                          //   openProfileModal(data.id);
                          // }}
                          className=" p-2 text-red cursor-pointer"
                        >
                          Delete
                        </p>
                      </div>
                    )}
                    <i
                      onClick={() => {
                        toggleOptions(data.id);
                      }}
                    >
                      <MdOutlineMoreHoriz />
                    </i>
                  </td> */}
                </tr>
              </tbody>
            ))
          ) : (
            <tbody>
              <tr className="border-b-0">
                <td colSpan={8} className=" border-b-0">
                  <NoDataComponent />
                </td>
              </tr>
            </tbody>
          )}
        </table>
        <Pagination
          data={allScriptures}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          firstIndex={firstIndex}
          lastIndex={lastIndex}
          npage={npage}
        />
      </div>
    </div>
  );
};

export default AllScriptures;
