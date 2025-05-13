import React, { useContext, useState, useEffect, useRef, useMemo } from "react";
import { ScriptureContext } from "../../context/ScriptureContext";
import NoDataComponent from "../NoDataComponent";
import { DarkModeContext } from "../../context/DarkModeContext";
import { LuChevronsUpDown } from "react-icons/lu";
import { MdOutlineMoreHoriz } from "react-icons/md";
import usePagination from "../../hooks/usePagination";
import useSort from "../../hooks/useSort";
import Pagination from "../Pagination";
import EditScripture from "../DailyScripturePopups/EditScripture";
import DeleteScripture from "../DailyScripturePopups/DeleteScripture";
import SuccessModal from "../DailyScripturePopups/SuccessModal";
import ViewScriptureDetails from "../DailyScripturePopups/ViewScriptureDetails";
import { RiFilter3Line } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";

const UploadedScriptures = ({
  scriptures,
  setIsSuccessModal,
  editModal,
  setEditModal,
}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [selectedScriptureId, setSelectedScriptureId] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const {
    deleteScripture,
    deleteModal,
    setDeleteModal,
    isScriptureDetails,
    setIsScriptureDetails,
    viewScriptureModal,
    eachScripture,
    setEachScripture,
  } = useContext(ScriptureContext);
  const [isOpenOptions, setIsOpenOptions] = useState(-1);
  const [successEditModal, setSuccessEditModal] = useState(false);
  useEffect(() => {
    if (successEditModal) {
      const timeout = setTimeout(() => {
        setSuccessEditModal(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [successEditModal]);
  const toggleOptions = (index) => {
    setIsOpenOptions(isOpenOptions === index ? null : index);
  };
  const uploadedScriptures = scriptures.filter(
    (item) => item.status === "uploaded"
  );
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
      key: "bibleVerse",
      Label: "Bible verse",
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
  const filteredScriptures = useMemo(() => {
    return uploadedScriptures.filter(
      (item) =>
        searchItem === "" ||
        item.bibleVersion?.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.bibleVerse?.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.prayer?.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.bibleVerse?.toLowerCase().includes(searchItem.toLowerCase())
    );
  }, [searchItem, uploadedScriptures]);
  const { sort, sortHeader, sortedData } = useSort(filteredScriptures);
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

  const handleDeleteClick = (id) => {
    setSelectedScriptureId(id);
    setDeleteModal(true);
    setIsOpenOptions(null);
  };
  const handleConfirmDelete = (id) => {
    deleteScripture(id);
    setDeleteModal(false);
    setIsSuccessModal(true);
  };
  const handleEditClick = (id) => {
    setSelectedScriptureId(id);
    setEditModal(true);
    setIsOpenOptions(null);
  };
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchItem(searchValue);

  };
  return (
    <div className="relative">
      {editModal && (
        <EditScripture
          editModal={editModal}
          setEditModal={setEditModal}
          scriptureId={selectedScriptureId}
          setSuccessEditModal={setSuccessEditModal}
        />
      )}
      {deleteModal && (
        <DeleteScripture
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          scriptureId={selectedScriptureId}
          onDelete={handleConfirmDelete}
        />
      )}
      {isScriptureDetails && (
        <ViewScriptureDetails
          setIsScriptureDetails={setIsScriptureDetails}
          scriptures={eachScripture}
        />
      )}
      {successEditModal && (
        <SuccessModal successMessage="Changes saved Successfully!" />
      )}
      <div
        className={` h-[22rem] pb-6 rounded-b-lg ${
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
            //   onClick={showFilterModal}
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
          {filteredScriptures.length > 0 ? (
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
                  <td>{data.bibleVerse}</td>
                  <td>{data.bibleVerse.substr(0, 20)}...</td>
                  <td>{data.bibleVersion}</td>
                  <td>{data.prayer.substr(0, 20)}...</td>
                  <td>
                    {isOpenOptions === data.id && (
                      <div
                        className={`rounded-lg ${
                          isDarkMode
                            ? `text-white bg-[#292929] border-white`
                            : `text-black bg-white border-borderColor`
                        } w-[100px] border absolute top-10 right-10 z-30 shadow-lg`}
                      >
                        <p
                          onClick={() => {
                            setIsOpenOptions(null);
                            viewScriptureModal(data.id, users);
                          }}
                          className=" border-b-[1px] border-gray-200 p-[6px] cursor-pointer"
                        >
                          View
                        </p>
                        <p
                          onClick={() => {
                            handleEditClick(data.id);
                          }}
                          className="border-b-[1px] border-gray-200 p-[6px] cursor-pointer"
                        >
                          Edit
                        </p>

                        <p
                          onClick={() => {
                            handleDeleteClick(data.id3);
                          }}
                          className=" p-[6px] text-red cursor-pointer"
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
                <td colSpan={8} className=" border-b-0">
                  <NoDataComponent />
                </td>
              </tr>
            </tbody>
          )}
        </table>
        <Pagination
          data={filteredScriptures}
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

export default UploadedScriptures;
