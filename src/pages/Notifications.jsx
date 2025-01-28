import React, { useState, useContext, useMemo, useEffect } from "react";
import NoDataComponent from "../component/NoDataComponent";
import { TiArrowUnsorted } from "react-icons/ti";
import { SearchOutlined } from "@ant-design/icons";
import { RiFilter3Line } from "react-icons/ri";
import { RiSettings5Line } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuMailOpen } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import { GoDot } from "react-icons/go";
import { DarkModeContext } from "../context/DarkModeContext";
import NotificationsData from "../data/notifications";

const Notifications = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isSettingsModal, setIsSettingsModal] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [notifications, setNotifications] = useState(NotificationsData);

  const [filteredNotifications, setFilteredNotifications] =
    useState(notifications);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchItem(searchValue);
    setFilteredNotifications(
      notifications.filter(
        (notification) =>
          notification.notificationStatus
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          notification.content
            ?.toLowerCase()
            .includes(searchValue.toLowerCase())
      )
    );
  };
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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
  //Mark as Read or Unread Function
  const markAsRead = (id) => {
    const updatedNotifications = filteredNotifications.map((notification) =>
      notification.id === id
        ? {
            ...notification,
            status: "unread" ? "read" : "unread",
          }
        : notification
    );
    setFilteredNotifications(updatedNotifications);
  };
  return (
    <div className="m-5">
      <div className={`relative`}>
        <button
          onClick={() => {
            setIsSettingsModal(!isSettingsModal);
          }}
          className="flex justify-end gap-1 p-2  rounded-md border-2 
                border-primary cursor-pointer ml-auto"
        >
          <RiSettings5Line fill="#9966cc" />
          <span className="text-primary text-sm">Manage Settings</span>
        </button>
        <div
          className={` rounded-2xl h-[30rem] ${
            isDarkMode ? `bg-grayBlack` : `bg-off-white`
          } mt-3`}
        >
          <div className={`flex justify-between items-center w-full pb-2 px-3`}>
            <h3 className="py-5 ">Notifications</h3>
            <div className="flex items-center gap-4">
              <div className="flex justify-center gap-2">
                {selectedUsers.length > 0 && (
                  <button className="bg-primary flex items-center justify-evenly gap-[2px] px-[5px] py-2 rounded-md w-28">
                    <i>
                      <LuMailOpen width={2} height={2} />
                    </i>
                    <p className="text-xs">Mark as read</p>
                  </button>
                )}
              </div>
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
                // onClick={showFilterModal}
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
            className={`custom-table font-sans text-[14px] ${
              isDarkMode ? `dark-mode` : `light-mode`
            } `}
          >
            <thead
              className={`${isDarkMode ? `bg-[#0d0d0d]` : `bg-off-white`}`}
            >
              <tr>
                <th
                  className={`flex items-center gap-2 cursor-pointer border-b-2 text-[10px] ${
                    isDarkMode
                      ? ` border-b-[#333333]  bg-off-black  `
                      : ` border-b-off-white`
                  }`}
                  // onClick={() => {
                  //   sortHeader(header);
                  // }}
                >
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    name="notification"
                    id="notification"
                    onChange={handleSelectAll}
                    checked={selectAll}
                  />
                  <div className="flex items-center justify-center gap-1">
                    <p>All Notifications</p>
                    <i>
                      <TiArrowUnsorted fill="#ffffff" />
                    </i>
                  </div>
                </th>
              </tr>
            </thead>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
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
                          <div className="flex flex-col ">
                            <div
                              className={`flex justify-normal ${
                                notification.notificationStatus === "Donation"
                                  ? `gap-[95px]`
                                  : `gap-[90px]`
                              }  items-start`}
                            >
                              <p
                                className={`font-bold ${
                                  notification.status === "unread"
                                    ? `text-primary`
                                    : `text-white`
                                }`}
                              >
                                New {notification.notificationStatus} submitted
                              </p>
                              <div className="flex items-center gap-1">
                                <p>{notification.date}</p>
                                <i>
                                  <GoDotFill fill="#ffffff" />
                                </i>
                                <p>{notification.time}</p>
                              </div>
                            </div>
                            <p className="text-off-white">
                              {notification.content}
                            </p>
                          </div>
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
                  <td colSpan={1} className="hover:bg-lightBlack border-b-0">
                  <NoDataComponent/>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
          {filteredNotifications.length > 0 && (
            <div className="flex justify-between absolute bottom-0 -pb-20 mb-6 left-0 w-full">
              <div className="flex justify-between items-center w-full px-4">
                <p>Showing 1 - 6 of 6</p>

                <div className="flex gap-2 items-center">
                  <button
                    className="btn-primary border-gray-300 bg-transparent text-gray-300"
                    // onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                  <button
                    className="btn-secondary border-primary rounded-md text-primary"
                    // onClick={() => setCurrentPage((prev) => prev + 1)}
                    // disabled={currentPage === npage}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
