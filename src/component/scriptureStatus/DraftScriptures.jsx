import React, { useContext, useState, useEffect, useRef } from "react";
import { ScriptureProvider } from "../../context/ScriptureContext";
import NoDataComponent from "../NoDataComponent";
import { DarkModeContext } from "../../context/DarkModeContext";
import { LuChevronsUpDown } from "react-icons/lu";
import { MdOutlineMoreHoriz } from "react-icons/md";
import Pagination from "../Pagination";
import usePagination from "../../hooks/usePagination";
import useSort from "../../hooks/useSort";

const DraftScriptures = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isOpenOptions, setIsOpenOptions] = useState(-1);
  const { scriptures, setScriptures } = useContext(ScriptureProvider);
  const draftScriptures = scriptures.filter((item) => item.status === "drafts");
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
      key: "action",
      Label: "Action",
    },
  ];
  const { sort, sortHeader, sortedData } = useSort(draftScriptures);
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
  return (
    <div className="relative">
      <div
        className={`${
          isOpenOptions ? `h-[22rem]` : `h-[20rem]`
        } pb-6 rounded-b-lg ${
          isDarkMode ? `bg-lightBlack dark-mode` : `light-mode`
        } `}
      >
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
                  className={`cursor-pointer text-[11px] ${
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
          {draftScriptures.length > 0 ? (
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
                  <td>{data.dateUploaded}</td>
                  <td>{data.bibleText}</td>
                  <td>{data.scripture.substr(0, 20)}...</td>
                  <td>{data.bibleVersion}</td>
                  <td>{data.prayer}</td>
                  <td>
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
                          className="border-b-[1px] border-gray-200 p-[6px] cursor-pointer"
                        >
                          Upload
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
                  </td>
                </tr>
              </tbody>
            ))
          ) : (
            <tbody>
              <tr className="border-b-0">
                <td colSpan={8} className="hover:bg-lightBlack border-b-0">
                  <NoDataComponent />
                </td>
              </tr>
            </tbody>
          )}
        </table>
        <Pagination
          data={draftScriptures}
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

export default DraftScriptures;
