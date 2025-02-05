import React, { useState, useContext, useEffect } from "react";
import EmptyState from "../component/EmptyState";
import { TiArrowUnsorted } from "react-icons/ti";
import { SearchOutlined } from "@ant-design/icons";
import { RiFilter3Line } from "react-icons/ri";
import { RiSettings5Line } from "react-icons/ri";
import { LuMailOpen } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import { GoDot } from "react-icons/go";
import { DarkModeContext } from "../context/DarkModeContext";
import FilterNotifications from "../component/Popups/FilterNotifications";
import Pagination from "../component/Pagination";
import usePagination from "../hooks/usePagination";
import { NotificationContextProvider } from "../context/NotificationContext";
import { Link } from "react-router-dom";

const Notifications = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [searchItem, setSearchItem] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  const { notifications, setNotifications, markAsRead, markAllAsRead } =
    useContext(NotificationContextProvider);

  useEffect(() => {
    setFilteredNotifications(notifications);
  }, [notifications]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchItem(searchValue);
    const filtered = notifications.filter(
      (notification) =>
        notification.type?.toLowerCase().includes(searchValue) ||
        notification.content?.toLowerCase().includes(searchValue)
    );
    setFilteredNotifications(filtered);
  };

  // Handle Individual User Selection
  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle Select All Records
  const handleSelectAll = () => {
    const allUserIds = notifications.map((user) => user.id);
    setSelectAll(!selectAll);
    setSelectedUsers(!selectAll ? allUserIds : []);
  };
  useEffect(() => {
    setSelectAll(
      selectedUsers.length === notifications.length && notifications.length > 0
    );
  }, [selectedUsers, notifications]);

  //Mark selected Notifcation as read
  const markSelectedAsRead = () => {
    const updatedNotifications = notifications.map((notif) =>
      selectedUsers.includes(notif.id) ? { ...notif, status: "read" } : notif
    );
    setNotifications(updatedNotifications);
    setSelectedUsers([]);
    setSelectAll(false);
  };
  const [filters, setFilters] = useState({
    selectedStatusOption: null,
    selectedTypeOption: null,
    dateRange: { from: "", to: "" },
  });
  const { currentPage, setCurrentPage, firstIndex, lastIndex, npage } =
    usePagination(notifications);

  return (
    <div className={`p-5 ${isDarkMode ? `bg-black` : `bg-off-white`}`}>
      {isFilter && (
        <FilterNotifications
          setIsFilter={setIsFilter}
          filters={filters}
          setFilters={setFilters}
          notifications={notifications}
          setNotifications={setNotifications}
        />
      )}

      <div className={`relative `}>
        <div
          className={`rounded-2xl h-[30rem] ${
            isDarkMode ? `bg-grayBlack` : `bg-white`
          } mt-10`}
        >
          <div className={`flex justify-between items-center w-full px-4 py-5`}>
            <h3 className="">Notifications</h3>
            <div className="flex items-center gap-4">
              {selectedUsers.length > 0 && (
                <div className="flex justify-center gap-2">
                  {selectedUsers.length < filteredNotifications.length ? (
                    <button
                      onClick={markSelectedAsRead}
                      className={`bg-primary flex items-center justify-evenly gap-[2px] px-[5px] py-2 rounded-md w-28 text-white`}
                    >
                      <i>
                        <LuMailOpen width={2} height={2} />
                      </i>
                      <p className={`text-xs`}>Mark as read</p>
                    </button>
                  ) : (
                    <button
                      onClick={
                        () => {
                        setSelectedUsers([]);
                        setSelectAll(false)
                        markAllAsRead()
                      }
                    }
                      className={`bg-primary flex items-center justify-evenly gap-[2px] px-[5px] py-2 rounded-md w-32 text-white`}
                    >
                      <i>
                        <LuMailOpen width={2} height={2} />
                      </i>
                      <p className={`text-xs`}>Mark all as read</p>
                    </button>
                  )}
                </div>
              )}
              {/*---------------------------------------- Search Bar  ---------------------------------*/}
              <div
                className={`flex justify-left items-center gap-2 p-3 rounded-lg w-[300px] ${
                  isDarkMode ? `bg-off-black` : `bg-off-white`
                } ]
                            `}
              >
                <SearchOutlined
                  style={{
                    fill: isDarkMode ? "black" : "white",
                    fontSize: "16px",
                  }}
                />
                <input
                  className="border-none outline-none bg-transparent w-[200px] text-xs placeholder:text-xs"
                  type="text"
                  name="search"
                  id="search-user"
                  placeholder="Search notifications"
                  value={searchItem}
                  onChange={handleSearch}
                />
              </div>
              <div
                onClick={() => {
                  setIsFilter(!isFilter);
                }}
                className="flex justify-center items-center gap-1 p-2 rounded-md border-2 border-primary cursor-pointer "
              >
                <i>
                  <RiFilter3Line fill="#9966cc" />
                </i>
                <p className=" text-primary text-sm">Filter</p>
              </div>
            </div>
          </div>
          <table
            className={`custom-table overflow-hidden font-sans text-[14px] ${
              isDarkMode ? `bg-lightBlack dark-mode` : `light-mode`
            } `}
          >
            <thead
              className={` text-xs ${
                isDarkMode ? `bg-near-black` : `bg-off-white text-black`
              }`}
            >
              <tr>
                <th
                  className={`flex items-center gap-2 cursor-pointer border-b-2 text-[10px] ${
                    isDarkMode
                      ? ` border-b-[#333333]  bg-off-black  `
                      : ` border-b-off-white`
                  }`}
                >
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    name="notification"
                    id="notification"
                    onChange={handleSelectAll}
                    checked={selectAll}
                  />
                  <div
                    className={`flex items-center justify-center gap-1 ${
                      isDarkMode ? `bg-off-black` : `bg-off-white`
                    }`}
                  >
                    <p
                      className={`${isDarkMode ? `text-white` : `text-black`}`}
                    >
                      All Notifications
                    </p>
                    <i>
                      <TiArrowUnsorted fill="#ffffff" />
                    </i>
                  </div>
                </th>
              </tr>
            </thead>
            {filteredNotifications.length > 0 ? (
              filteredNotifications
                .slice(firstIndex, lastIndex)
                .map((notification) => (
                  <tbody className="relative text-xs" key={notification.id}>
                    <tr
                      className={` ${
                        isDarkMode
                          ? `hover:bg-[#313131]`
                          : `hover:bg-off-white text-black`
                      }`}
                    >
                      <td className="flex justify-between w-full">
                        <div className="flex align-top items-start ">
                          <div className="flex gap-3 items-center justify-normal">
                            <input
                              className="cursor-pointer"
                              type="checkbox"
                              name="notification"
                              id="notification"
                              onChange={() => handleUserSelect(notification.id)}
                              checked={selectedUsers.includes(notification.id)}
                            />
                            <Link
                              to={`${
                                notification.type === "Donation"
                                  ? `/dashboard/donations`
                                  : "/dashboard/all-testimonies"
                              }`}
                            >
                              <div className="flex flex-col gap-1">
                                <div
                                  className={`flex justify-normal ${
                                    notification.type === "Donation"
                                      ? `gap-[95px]`
                                      : `gap-[90px]`
                                  }  items-start`}
                                >
                                  <p
                                    className={`
                                    font-bold 
                                    ${
                                      notification.status === "unread"
                                        ? isDarkMode
                                          ? `text-primary`
                                          : `text-primary-light-mode`
                                        : isDarkMode
                                        ? `text-white`
                                        : `text-black`
                                    }
                                  `}
                                  >
                                    New {notification.type} submitted
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <p>{notification.date}</p>
                                    <i>
                                      <GoDotFill fill="#ffffff" />
                                    </i>
                                    <p>{notification.time}</p>
                                  </div>
                                </div>
                                <p
                                  className={`${
                                    isDarkMode
                                      ? `text-off-white`
                                      : `text-off-black`
                                  }`}
                                >
                                  {notification.content}
                                </p>
                              </div>
                            </Link>
                          </div>
                        </div>

                        <i
                          onClick={() => {
                            markAsRead(notification.id);
                            console.log(notification.status);
                          }}
                        >
                          {notification.status === "unread" ? (
                            <GoDotFill fill="#9966CC" fontSize={25} />
                          ) : (
                            <GoDot fill="#9966CC" fontSize={25} />
                          )}
                        </i>
                      </td>
                    </tr>
                  </tbody>
                ))
            ) : (
              <tbody>
                <tr className="border-b-0">
                  <td colSpan={1} className="hover:bg-transparent border-b-0 border-b-transparent">
                    <EmptyState />
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        {/* <-------------------------------------Pagination-------------------------------------> */}
        <Pagination
          data={filteredNotifications}
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

export default Notifications;
