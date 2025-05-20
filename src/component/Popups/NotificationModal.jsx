import React, { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import { DarkModeContext } from "../../context/DarkModeContext";
import { RiSettings5Line } from "react-icons/ri";
import { GoDotFill } from "react-icons/go";
import { GoDot } from "react-icons/go";
import { Link } from "react-router-dom";
import { NotificationContextProvider } from "../../context/NotificationContext";
const NotificationModal = ({ isNotifModal, setIsNotifModal }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { notifications, setNotifications, markAsRead, markAllAsRead } =
    useContext(NotificationContextProvider);
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsNotifModal(false);
    }
  };
  const unreadNotif = notifications.filter(
    (notif) => notif.status === "unread"
  );

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div
        className={`fixed inset-0 bg-opacity-50 
          ${isDarkMode ? "bg-black" : "bg-off-white"}`}
        onClick={handleBackdropClick}
      />
      <div
        className={`z-50 shadow-2xl rounded-lg w-[420px]  modal relative ${
          isDarkMode ? `bg-black` : `bg-off-white`
        } `}
      >
        <div
          className={`flex justify-between items-center p-3  ${
            isDarkMode ? `text-white` : `text-black`
          }`}
        >
          <h2 className="text-lg">Notifications</h2>
          <i
            className="cursor-pointer"
            onClick={() => {
              setIsNotifModal(false);
            }}
          >
            <MdClose />
          </i>
        </div>
        <div className="border-t-[1px] border-t-borderColor py-3 px-2">
          <button
            className="flex justify-end items-center gap-1 p-2  rounded-md border-[1px]
                            border-primary cursor-pointer ml-auto text-sm"
          >
            <RiSettings5Line fill="#9966cc" />
            <span className="text-primary text-xs">Settings</span>
          </button>
        </div>
        <div
          className={`${isDarkMode ? `text-off-white` : `text-black`} text-sm `}
        >
          <div className="flex flex-col gap-2 justify-normal">
            {unreadNotif.map((notification, index) => (
              <div
                key={index}
                className="flex gap-3 justify-between w-full border-t-[1px] border-t-borderColor pt-1 px-3"
              >
                <div className="flex flex-col ">
                  <div
                    className={`flex justify-normal 
                  `}
                  >
                    <p
                      className={`font-bold 
                         ${
                           notification.status === "unread"
                             ? `text-primary`
                             : `text-white`
                         }
                    `}
                    >
                      New {notification.type} submitted
                    </p>
                  </div>
                  <p
                    className={`${
                      isDarkMode ? `text-off-white` : `text-off-black`
                    } text-[12px]`}
                  >
                    {notification.content}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-near-white">
                    <p>{notification.date}</p>
                    <i>
                      <GoDotFill fill="#ffffff" />
                    </i>
                    <p>{notification.time}</p>
                  </div>
                </div>
                <i
                  className="cursor-pointer"
                  onClick={() => {
                    markAsRead(notification.id);
                    console.log(notification.status);
                  }}
                >
                  {notification.status === "unread" && (
                    <GoDotFill fill="#9966CC" fontSize={20} />
                  )}
                </i>
              </div>
            ))}
          </div>
          {unreadNotif.length === 0 && (
            <div className="text-center pt-10 pb-20">
              No unread Notifications
            </div>
          )}
        </div>

        <div className="flex justify-between items-center w-full border-t-[1px] border-borderColor p-3">
          <p
            onClick={markAllAsRead}
            className="text-xs text-primary cursor-pointer"
          >
            Mark All as Read
          </p>
          <button
            onClick={() => {
              setIsNotifModal(false);
            }}
            className="border-[1px] border-primary rounded-md text-primary text-xs p-2"
          >
            <Link to="notifications"> View all notifications</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
