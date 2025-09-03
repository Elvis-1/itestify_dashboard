import React, { useState, useEffect } from "react";

const Notifications = () => {
  const [searchItem, setSearchItem] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [notificationsData, setNotificationsData] = useState([
    {
      id: 1,
      type: "Gift",
      title: "New Gift Received",
      content:
        "Gift of ₦5,000.00 received from Emmanuel Oreoluwa(emmanueloreoluwa@gmail.com) via Flutterwave.",
      date: "09/09/2024",
      time: "09:00PM",
      status: "unread",
    },
    {
      id: 2,
      type: "Text Testimony",
      title: "New Text Testimony Submitted",
      content:
        'Michael Chen has submitted a new testimony: "God\'s faithfulness in my business journey..."',
      date: "09/09/2024",
      time: "09:00PM",
      status: "unread",
    },
    {
      id: 3,
      type: "Comment",
      title: "New Comment on Video Testimony",
      content:
        'Grace Adebayo commented on "Healing testimony from cancer" video: "Prase..."',
      date: "09/09/2024",
      time: "09:00PM",
      status: "unread",
    },
  ]);

  const [filteredNotifications, setFilteredNotifications] =
    useState(notificationsData);

  // Filter notifications on search
  useEffect(() => {
    const searchValue = searchItem.toLowerCase();
    const filtered = notificationsData.filter(
      (notification) =>
        notification.title?.toLowerCase().includes(searchValue) ||
        notification.content?.toLowerCase().includes(searchValue)
    );
    setFilteredNotifications(filtered);
  }, [notificationsData, searchItem]);

  const handleUserSelect = (userId) => {
    setSelectedNotifications((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const allIds = notificationsData.map((n) => n.id);
    setSelectAll(!selectAll);
    setSelectedNotifications(!selectAll ? allIds : []);
  };

  useEffect(() => {
    setSelectAll(
      selectedNotifications.length === notificationsData.length &&
      notificationsData.length > 0
    );
  }, [selectedNotifications, notificationsData]);

  const handleMarkAsRead = (id) => {
    const updated = notificationsData.map((n) =>
      n.id === id ? { ...n, status: "read" } : n
    );
    setNotificationsData(updated);
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  };

  const handleMarkAllAsRead = () => {
    const updated = notificationsData.map((n) => ({ ...n, status: "read" }));
    setNotificationsData(updated);
    setSelectedNotifications([]);
  };

  const handleDeleteSelected = () => {
    const updated = notificationsData.filter(
      (n) => !selectedNotifications.includes(n.id)
    );
    setNotificationsData(updated);
    setSelectedNotifications([]);
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const FilterNotifications = ({ setIsFilter }) => (
    <div className="absolute top-20 right-4 bg-[#1c1c1c] rounded-lg shadow-lg z-10 w-[35%] mr-8 mt-2 border h-[85%] border-gray-700 flex flex-col items-center">
      <div className="w-[93%] h-full flex flex-col ">
        {/* Header */}
        <div className="py-4 border-b-2 border-gray-700 flex justify-between items-center">
          <h1 className="text-[20px] font-semibold">Notifications</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 cursor-pointer"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={() => setIsFilter(false)}
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>

        {/* Settings */}
        <div className="py-4 border-b-2 border-gray-700 flex justify-end items-center gap-4">
          <button className="py-2 px-4 rounded-lg text-[#9966CC] border border-[#9966CC] hover:bg-[#3d3d3d]">
            Settings
          </button>
        </div>

        {/* Notifications */}
        <div className="flex-1 w-full flex flex-col overflow-y-scroll hide-scrollbar">
          {notificationsData.map((notification) => (
            <div
              key={notification.id}
              className="w-full flex flex-col justify-around border-b-2 border-gray-700 py-4 last:border-b-0 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-200">{notification.title}</p>
                <span
                  className={`w-2 h-2 rounded-full ${
                    notification.status === "unread"
                      ? "border-2 border-[#9966CC]"
                      : "bg-[#9966CC]"
                  }`}
                ></span>
              </div>
              <p className="text-[12px] text-gray-400 mt-1">{notification.content}</p>
              <div className="flex items-center gap-2 text-[12px] text-gray-400 mt-2">
                <p>{notification.date}</p>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <p>{notification.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer buttons */}
        <div className="py-4 border-t border-gray-700 flex items-center justify-between gap-2">
          {/* <button
            onClick={handleDeleteSelected}
            className=" text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            Delete
          </button> */}
          <button
            onClick={handleMarkAllAsRead}
            className="bg-[#2a2a2a] text-gray-400 py-2 px-4 rounded-lg hover:bg-[#3d3d3d] border border-gray-700"
          >
            Mark All as read
          </button>
          <button
            onClick={() => setIsFilter(false)}
            className="bg-[#9966CC] text-white py-2 px-4 rounded-lg hover:bg-[#804cb3]"
          >
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );

  const SuccessModal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#1c1c1c] p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 className="text-xl font-bold text-white mb-4">Success!</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-[#9966CC] text-white py-2 px-6 rounded-lg hover:bg-[#804cb3] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-black min-h-screen font-sans">
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      {showSuccessModal && (
        <SuccessModal
          message="Notifications successfully deleted!"
          onClose={handleCloseModal}
        />
      )}

      <div className="rounded-2xl bg-[#1c1c1c] text-white p-6 md:p-8 h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Notifications</h2>
          <div className="flex items-center gap-4">
            {selectedNotifications.length > 0 && (
              <>
                <button
                  onClick={handleDeleteSelected}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center gap-2 bg-red"
                >
                  Delete
                </button>
                <button
                  onClick={handleMarkAllAsRead}
                  className="bg-[#2a2a2a] text-gray-400 py-2 px-4 rounded-lg hover:bg-[#3d3d3d] border border-gray-700 flex items-center gap-2"
                >
                  Mark All as read
                </button>
              </>
            )}
            {/* Filter button */}
            <button
              onClick={() => setIsFilter(true)}
              className="bg-[#2a2a2a] text-[#9966cc] py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-[#3d3d3d] border border-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              <span>Filter</span>
            </button>
          </div>
        </div>

        {isFilter && <FilterNotifications setIsFilter={setIsFilter} />}

        {/* Select All */}
        <div className="flex items-center mb-6 border-b border-gray-700 pb-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-400">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 rounded-sm bg-gray-700 text-[#9966CC] border-gray-600"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <span>All Notifications</span>
          </label>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-4 p-4 border-b border-gray-700 last:border-b-0 cursor-pointer hover:bg-[#2a2a2a] rounded-lg"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                {notification.status === "read" ? (
                  <span className="text-[#9966cc] w-4 h-4 mt-1">✅</span>
                ) : (
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 mt-1 rounded-sm bg-gray-700 text-[#9966CC] border-gray-600"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleUserSelect(notification.id);
                    }}
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-200">{notification.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{notification.date}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{notification.time}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          notification.status === "unread"
                            ? "border-2 border-[#9966CC]"
                            : "bg-[#9966CC]"
                        }`}
                      ></span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{notification.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">No notifications found.</div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
          <span className="text-gray-400 text-sm">
            Showing 1-{filteredNotifications.length} of {filteredNotifications.length}
          </span>
          <div className="flex gap-2">
            <button className="bg-[#2a2a2a] text-gray-400 py-2 px-4 rounded-lg hover:bg-[#3d3d3d] border border-gray-700">
              Previous
            </button>
            <button className="bg-[#9966CC] text-white py-2 px-4 rounded-lg hover:bg-[#804cb3]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
