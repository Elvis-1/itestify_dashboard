import React, { useContext, useEffect, useState } from "react";
import {
  AppstoreOutlined,
  CaretDownFilled,
  CaretUpFilled,
  PictureOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import { notification, Switch, Typography } from "antd";
import { MoonOutlined } from "@ant-design/icons";
import logo from "../assets/icons/Logo.png";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { CiSun } from "react-icons/ci";
import { CiChat1 } from "react-icons/ci";
import { MdOutlineAnalytics } from "react-icons/md";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { FaBullseye, FaRegUser } from "react-icons/fa6";
import { FaRegMoneyBill1 } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";
import NotificationModal from "../component/Popups/NotificationModal";
import { NotificationContextProvider } from "../context/NotificationContext";
import { useLocation} from "react-router-dom";
import { Modal } from "antd";

function Dashboard() {
  const [showTestimonyMenu, setShowTestimonyMenu] = useState(false);
  const [showAnalyticsMenu, setShowAnalyticsMenu] = useState(false);
  const [showInspirationalMenu, setShowInspirationalMenu] = useState(false);
  const [showAllTestimonies, setShowAllTestimonies] = useState(true);
  const [logoutModal, setLogoutModal] = useState(false);
  const [isNotifModal, setIsNotifModal] = useState(false);
  const [userFullname, setUserFullName] = useState('')
  const [userRole, setUserRole] = useState('')

  const { isDarkMode, toggleTheme } = useContext(DarkModeContext);

  const { notifications, setNotifications } = useContext(
    NotificationContextProvider
  );

  let user = localStorage.getItem('user')

  useEffect(() => {
    const userString = localStorage.getItem('user'); // Get the stored string
    const user = userString ? JSON.parse(userString) : null; // Parse safely
  
    setUserFullName(user?.full_name)
    setUserRole(user?.role)
  }, []);

  const navigate = useNavigate();

  function handleTestimonies() {
    setShowAllTestimonies(!showAllTestimonies);
    if (showAllTestimonies) {
      navigate("all-testimonies");
    } else {
      navigate("upload-testimonies");
    }
  }
  const location = useLocation();
  const handleCloseModal = () => {
    setLogoutModal(false);
  };

  const handleLogout = () => {
    // Clear token and user data from localStorage
    localStorage.removeItem("token");
    // localStorage.removeItem("user");
  
    // Redirect to the login page
    navigate("/login");
    message.success("Logged out successfully!");
  }

  return (
    <div className="relative">
      {isNotifModal && (
        <NotificationModal
          isNotifModal={isNotifModal}
          setIsNotifModal={setIsNotifModal}
        />
      )}
      <Modal
        open={logoutModal}
        onCancel={handleCloseModal}
        closeIcon={null}
        footer={null}
        styles={{
          content: {
            backgroundColor: "black",
            width: "350px",
            height: "auto",
            color: "white",
            margin: "0 auto",
            borderRadius: "8px",
            marginTop: "50px",
          },
          body: {
            backgroundColor: "#1717171",
            color: "white",
          },
        }}
      >
        <div className="flex flex-col max-w-xl items-center justify-center">
          <div>
            <>
              <p className="text-[20px] text-center pt-1">
                Are you sure you want to logout?
              </p>

              <div className="flex text-center items-center justify-center gap-2 mt-10">
                <button
                  onClick={handleCloseModal}
                  className="border border-primary rounded text-primary  px-5 text-sm py-2"
                >
                  Cancel
                </button>
                <Link to="/login">
                  <button
                    onClick={() => {
                      handleLogout()
                      handleCloseModal()
                    }}
                    className="rounded bg-primary px-5 text-sm py-2"
                  >
                    Log Out
                  </button>
                </Link>
              </div>
            </>
          </div>
        </div>
      </Modal>
      {/* <---------------------------TOP NAV BAR STARTS HERE ---------------------------> */}
      <div
        className={` flex font-sans font-bold px-2 h-12 fixed z-20 w-full
        ${
          isDarkMode
            ? "bg-[#313131] text-white"
            : "bg-white text-black border-r border-r-slate-100"
        }`}
      >
        <div className="flex gap-2 items-center w-[25%]">
          <img src={logo} className="w-[35px]" alt="" />
          <p className="font-sans  text-[15px] ">iTestified</p>
        </div>
        <div
          className={`flex items-center justify-between w-full
             ${isDarkMode ? "border-b border-b-borderColor" : " text-black "}`}
        >
          <div className="">
            <h4 className="text-[13px]">Hello Admin</h4>
            <p className="text-[10px] text-near-white">
              How are you doing today?
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<CiSun size={20} />}
              className="my-switch"
            />
            <div
              onClick={() => setIsNotifModal(true)}
              className={`bg-[#787878] w-[30px] 
                h-[30px] rounded-full flex items-center justify-center cursor-pointer
                ${isDarkMode ? "text-white" : "text-black"}`}
            >
              <IoIosNotificationsOutline style={{ fontSize: "20px" }} />
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`bg-[#787878] w-[30px] 
                  h-[30px] rounded-full flex items-center justify-center
                  ${isDarkMode ? "text-white" : "text-black"}`}
              >
                <PictureOutlined style={{ fontSize: "15px" }} />
              </div>
              <p className="text-[12px] w-[100px] font-bold">
                {userFullname} {userRole}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <-------------------------------------TOP NAV BAR ENDS HERE ------------------------------------> */}

      <div
        className={`flex  min-h-screen overflow-y-hidden  ${
          isDarkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        {/* <------------------------------WHOLE SIDE NAV BAR MAIN MENU STARTS HERE------------------------> */}
        <div
          className={`w-[20%] sidebar-container h-screen overflow-y-auto fixed left-0 top-0 pt-2 z-10 
            ${
              isDarkMode
                ? "bg-[#313131] text-white"
                : "bg-white text-black border-r border-r-slate-100"
            }`}
        >
          {/* sidebar main section starts here */}
          <div
            className={`${
              isDarkMode ? " bg-[#313131] text-white" : "bg-white text-black "
            } pt-5`}
          >
            <div className="p-3 text-[13px] mt-8 font-sans opacity-[0.7]">
              <h1 className="p-1 font-sans">MAIN MENU</h1>
            </div>

            <Link to="">
              <div
                className={`font-sans flex items-center gap-1 p-3 text-[13px] ${
                  location.pathname === "/dashboard"
                    ? "bg-primary text-white"
                    : "bg-transparent"
                }`}
              >
                <AppstoreOutlined style={{ fontSize: "18px" }} />
                <p>Overview</p>
              </div>
            </Link>

            <Link to="users">
              <div
                className={`font-sans flex items-center gap-1 p-3 text-[13px] ${
                  location.pathname === "/dashboard/users"
                    ? "bg-primary text-white"
                    : "bg-transparent"
                }`}
              >
                <UsergroupAddOutlined style={{ fontSize: "20px" }} />
                <p>Users</p>
              </div>
            </Link>

            <div
              className={`font-sans flex items-center gap-1 p-3 text-[13px] ${
                location.pathname === "/dashboard/all-testimonies" ||
                location.pathname === "/dashboard/upload-testimonies"
                  ? "bg-primary text-white"
                  : "bg-transparent"
              }`}
            >
              <CiChat1 style={{ fontSize: "20px" }} />
              <div
                onClick={() => setShowTestimonyMenu(!showTestimonyMenu)}
                className="flex items-center justify-between w-[100%] cursor-pointer"
              >
                <p>Testimonies</p>
                {showTestimonyMenu ? (
                  <CaretUpFilled style={{ fontSize: "15px" }} />
                ) : (
                  <CaretDownFilled style={{ fontSize: "15px" }} />
                )}
              </div>
            </div>
            {showTestimonyMenu ? (
              <div className=" cursor-pointer text-[13px] flex flex-col  justify-normal pl-2 ">
                {/* dynamically navigating to each testimonies component */}
                <Link to="all-testimonies">
                  <input
                    type="button"
                    value={"All Testimonies"}
                    placeholder="All Testimonies"
                    className=" border-none outline-none p-2 bg-transparent cursor-pointer "
                    onClick={handleTestimonies}
                  />
                </Link>
                <Link to="upload-testimonies">
                  <input
                    type="button"
                    value={"Upload Testimonies"}
                    placeholder="upload Testimonies"
                    className=" border-none outline-none p-2 bg-transparent cursor-pointer"
                    onClick={handleTestimonies}
                  />
                </Link>
              </div>
            ) : (
              ""
            )}

            <div
              className={`font-sans flex items-center gap-1 p-3 text-[13px] ${
                location.pathname === "/dashboard/inspirational-pictures" ||
                location.pathname === "/dashboard/upload-inspirational-pictures"
                  ? "bg-primary text-white"
                  : "bg-transparent"
              }`}
            >
              <PictureOutlined style={{ fontSize: "17px" }} />
              <div
                onClick={() => setShowInspirationalMenu(!showInspirationalMenu)}
                className="flex items-center justify-between w-[100%] cursor-pointer"
              >
                <p>Inspirational Pictures</p>
                {showInspirationalMenu ? (
                  <CaretUpFilled style={{ fontSize: "15px" }} />
                ) : (
                  <CaretDownFilled style={{ fontSize: "15px" }} />
                )}
              </div>
            </div>
            {showInspirationalMenu ? (
              <div className=" cursor-pointer text-[13px] flex flex-col  justify-normal pl-2">
                <Link to="inspirational-pictures">
                  <input
                    type="button"
                    value={"All Pictures"}
                    className="border-none outline-none p-2 bg-transparent cursor-pointer "
                  />
                </Link>
                <Link to="upload-inspirational-pictures">
                  <input
                    type="button"
                    value={"Upload Pictures"}
                    className="border-none outline-none p-2 bg-transparent cursor-pointer"
                  />
                </Link>
              </div>
            ) : (
              ""
            )}

            <Link to="donations">
              <div
                className={`font-sans flex items-center gap-1 p-3 text-[13px] cursor-pointer ${
                  location.pathname === "/dashboard/donations"
                    ? "bg-primary text-white"
                    : "bg-transparent"
                }`}
              >
                <FaRegMoneyBill1 style={{ fontSize: "20px" }} />
                <p className="">Donations</p>
              </div>
            </Link>

            <Link to="notifications">
              <div
                className={`font-sans flex items-center gap-1 p-3 text-[13px] cursor-pointer ${
                  location.pathname === "/dashboard/notifications"
                    ? "bg-primary text-white"
                    : "bg-transparent"
                }`}
              >
                <IoIosNotificationsOutline style={{ fontSize: "24px" }} />
                <div className="flex items-center justify-between w-[100%]">
                  <p className="">Notifications history</p>
                  {notifications?.filter((notif) => notif.status === "unread")
                    .length > 0 && (
                    <div
                      className="flex items-center justify-center 
                bg-red  w-[30px] h-[30px] p-2 rounded-full text-center"
                    >
                      <p
                        className={`font-sans text-[12px] text-center text-white`}
                      >
                        {notifications?.filter(
                          (notif) => notif.status === "unread"
                        ).length || ""}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
            <Link to="reviews">
              <div
                className={`font-sans flex items-center gap-1 p-3 text-[13px] cursor-pointer ${
                  location.pathname === "/dashboard/reviews"
                    ? "bg-primary text-white"
                    : "bg-transparent"
                }`}
              >
                <CiChat1 style={{ fontSize: "20px" }} />
                <p className="font-sans text-[13px] ">Reviews</p>
              </div>
            </Link>

            <div
              className={`font-sans flex items-center gap-1 p-3 text-[13px] ${
                location.pathname === "/dashboard/testimonies-analytics" ||
                location.pathname === "/dashboard/donations-analytics"
                  ? `bg-primary text-white`
                  : `bg-transparent`
              }`}
            >
              <MdOutlineAnalytics style={{ fontSize: "20px" }} />
              <div
                onClick={() => setShowAnalyticsMenu(!showAnalyticsMenu)}
                className="flex items-center justify-between w-[100%] cursor-pointer "
              >
                <p className=" font-sans">Analytics</p>
                {showAnalyticsMenu ? (
                  <CaretUpFilled style={{ fontSize: "15px" }} />
                ) : (
                  <CaretDownFilled style={{ fontSize: "15px" }} />
                )}
              </div>
            </div>
            {showAnalyticsMenu ? (
              <div className=" cursor-pointer text-[13px] flex flex-col  justify-normal pl-2">
                <Link to="testimonies-analytics">
                  <input
                    type="button"
                    value={"Testimonies"}
                    placeholder=""
                    className=" border-none outline-none p-2 bg-transparent cursor-pointer "
                  />
                </Link>
                <Link to="donations-analytics">
                  <input
                    type="button"
                    value={"Donations"}
                    placeholder=""
                    className=" border-none outline-none p-2 bg-transparent cursor-pointer "
                  />
                </Link>
              </div>
            ) : (
              ""
            )}

            {/* settings section starts here */}
            <h1 className="p-3 text-[13px] mt-5 font-sans opacity-[0.7]">
              SETTINGS
            </h1>
            <Link to="profile">
              <div
                className={`font-sans flex items-center gap-1 p-3 text-[13px] cursor-pointer ${
                  location.pathname === "/dashboard/profile"
                    ? "bg-primary text-white"
                    : "bg-transparent"
                }`}
              >
                <FaRegUser style={{ fontSize: "15px" }} />
                <p className="opacity-[0.7]">My Profile</p>
              </div>
            </Link>
            <Link to="notification-settings">
              <div
                className={`font-sans flex items-center gap-1 p-3 text-[13px] cursor-pointer ${
                  location.pathname === "/dashboard/notification-settings"
                    ? "bg-primary text-white"
                    : "bg-transparent"
                }`}
              >
                <IoIosNotificationsOutline style={{ fontSize: "24px" }} />
                <p className="opacity-[0.7]">Notification settings</p>
              </div>
            </Link>

            <Link to="general-settings">
              <div
                className={`font-sans flex items-center gap-1 p-3 text-[13px] cursor-pointer ${
                  location.pathname === "/dashboard/general-settings"
                    ? "bg-primary text-white"
                    : "bg-transparent"
                }`}
              >
                <MdOutlineSettings style={{ fontSize: "20px" }} />
                <p>General</p>
              </div>
            </Link>

            <div
              onClick={() => setLogoutModal(true)}
              className="cursor-pointer font-sans flex items-center gap-1 p-3 text-[13px] active:bg-[#9966CC]"
            >
              <IoIosLogOut style={{ fontSize: "20px" }} />
              <p className="opacity-[0.7]">Logout</p>
            </div>
          </div>
          {/* sidebar main section ends here */}
        </div>
        {/* <-----------------------------WHOLE SIDE BAR MAIN MENU ENDS HERE-------------------------> */}

        {/* main dashboard section starts here */}
        <div
          className={` ${
            isDarkMode ? `bg-black` : `bg-off-white`
          } pt-16 flex-grow ml-[20%] h-screen overflow-y-auto`}
        >
          <Outlet />
        </div>
        {/* main dashboard section ends here */}
      </div>
    </div>
  );
}

export default Dashboard;
