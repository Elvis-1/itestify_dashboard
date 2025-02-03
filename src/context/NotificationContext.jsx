import React, { createContext, useState } from "react";
import NotificationsData from "../data/notifications";

export const NotificationContextProvider = createContext();
const NotificationContext = ({ children }) => {
  const [notifications, setNotifications] = useState(NotificationsData);

  //Mark as Read individually
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.id === id ? { ...notif, status: "read" } : notif
    );
    setNotifications(updatedNotifications);
  };

  //Mark all selected as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      status: "read",
    }));
    setNotifications(updatedNotifications);
  };
  return (
    <NotificationContextProvider.Provider
      value={{
        notifications,
        setNotifications,
        markAllAsRead,
        markAsRead,
      }}
    >
      {children}
    </NotificationContextProvider.Provider>
  );
};

export default NotificationContext;
