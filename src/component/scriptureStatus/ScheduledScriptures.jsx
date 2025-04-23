import React, { useContext, useState, useEffect, useRef, useMemo } from "react";
import { ScriptureContext } from "../../context/ScriptureContext";
import NoDataComponent from "../NoDataComponent";
import { DarkModeContext } from "../../context/DarkModeContext";
import { LuChevronsUpDown } from "react-icons/lu";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { RiFilter3Line } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import Pagination from "../Pagination";
import usePagination from "../../hooks/usePagination";
import useSort from "../../hooks/useSort";
import DeleteScripture from "../DailyScripturePopups/DeleteScripture";
import EditScripture from "../DailyScripturePopups/EditScripture";
import SuccessModal from "../DailyScripturePopups/SuccessModal";
import ViewScriptureDetails from "../DailyScripturePopups/ViewScriptureDetails";
import WarningModal from "../DailyScripturePopups/WarningModal";

const ScheduledScriptures = ({
  scriptures,
  setIsSuccessModal,
  editModal,
  setEditModal,
}) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isOpenOptions, setIsOpenOptions] = useState(-1);
  const [searchItem, setSearchItem] = useState("");
  const [successEditModal, setSuccessEditModal] = useState(false);
  const [successUploadModal, setSuccessUploadModal] = useState(false);
  const [isWarningUploadModal, setIsWarningUploadModal] = useState(false);
  useEffect(() => {
    if (successEditModal || successUploadModal) {
      const timeout = setTimeout(() => {
        setSuccessEditModal(false);
        setSuccessUploadModal(false)
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [successEditModal, successUploadModal]);
  const {
    deleteScripture,
    deleteModal,
    setDeleteModal,
    isScriptureDetails,
    setIsScriptureDetails,
    viewScriptureModal,
    eachScripture,
    uploadScheduledScripture
  } = useContext(ScriptureContext);
  const [selectedScriptureId, setSelectedScriptureId] = useState(null);
  const scheduledScriptures = scriptures.filter(
    (item) => item.status === "scheduled"
  );
  const toggleOptions = (index) => {
    setIsOpenOptions(isOpenOptions === index ? null : index);
  };
  const filteredScriptures = useMemo(() => {
    return scheduledScriptures.filter(
      (item) =>
        searchItem === "" ||
        item.bibleVersion?.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.scripture?.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.prayer?.toLowerCase().includes(searchItem.toLowerCase()) ||
        item.bibleText?.toLowerCase().includes(searchItem.toLowerCase())
    );
  }, [searchItem, scheduledScriptures]);
  const tableHeaders = [
    {
      key: "serialno",
      Label: "S/N",
    },
    {
      key: "dateScheduled",
      Label: "Date Scheduled",
    },
    {
      key: "timeScheduled",
      Label: "Time Scheduled",
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
    console.log(id);
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
  const handleUploadScheduled = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const hours = currentDate.getHours() % 12 || 12;
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const timeFormat = currentDate.getHours() >= 12 ? "PM" : "AM";

    // Update the scripture to mark it as uploaded
    uploadScheduledScripture(selectedScriptureId, {
      status: "uploaded",
      dateUploaded: formattedDate,
      selectedDate: formattedDate,
      selectedTime: `${hours}:${minutes}`,
      selectedTimeFormat: timeFormat,
    });

    setIsWarningUploadModal(false);
    setSuccessUploadModal(true); // Show success modal
  };
  const handleOpenScheduledModal = (id) => {
    setSelectedScriptureId(id);
    setIsWarningUploadModal(true);
    setIsOpenOptions(null);
  };
  const handleSubmitUpload = () => {
    //submitScripture(); // Upload scripture immediately
    setIsWarningUploadModal(false);
    //resetForm();
  };
  const handleCancelUpload = () => {
    setIsWarningUploadModal(false); // Close warning modal without action
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
      {successUploadModal && (
        <SuccessModal successMessage="Scripture Uploaded Successfully" />
      )}
      {isWarningUploadModal && (
        <WarningModal
          title={`Upload Scripture`}
          message={`You are about to upload this scripture ahead of the scheduled date and time. Once uploaded, it will immediately become visible to all users, and the original schedule will be canceled. Do you wish to proceed?`}
          onCancel={handleCancelUpload}
          onReplace={handleUploadScheduled}
          buttonText="Yes, Upload"
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
                  <td>{data.selectedDate}</td>
                  <td>{data.selectedTime + " " + data.selectedTimeFormat}</td>
                  <td>{data.bibleText}</td>
                  <td>{data.scripture.substr(0, 20)}...</td>
                  <td>{data.bibleVersion}</td>
                  <td>{data.prayer.substr(0, 20)}...</td>
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
                          onClick={() => {
                            setIsOpenOptions(null);
                            viewScriptureModal(data.id, users);
                          }}
                          className=" border-b-[1px] border-gray-200 p-2 cursor-pointer"
                        >
                          View
                        </p>
                        <p
                          onClick={() => {
                            handleEditClick(data.id);
                          }}
                          className="border-b-[1px] border-gray-200 p-2 cursor-pointer"
                        >
                          Edit
                        </p>
                        <p
                          onClick={() => {
                            handleOpenScheduledModal(data.id);
                          }}
                          className="border-b-[1px] border-gray-200 p-2 cursor-pointer"
                        >
                          Upload
                        </p>
                        <p
                          onClick={() => {
                            handleDeleteClick(data.id);
                          }}
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
                <td colSpan={8} className=" border-b-transparent">
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

export default ScheduledScriptures;
