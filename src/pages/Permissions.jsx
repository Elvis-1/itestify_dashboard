import React, { useContext, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import LoadingState from "../component/LoadingState";
const Permissions = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };
  return (
    <div className={` m-5`}>
      {isLoading && <LoadingState />}
      <div className="flex justify-between w-full pb-5 border-b border-b-borderColor">
        <p className="font-bold">Manage Permissions</p>
        <button onClick={handleClick} className="btn-primary px-3 text-xs">
          Save Changes
        </button>
      </div>
      <div
        className={`flex justify-between w-full px-4 ${
          isDarkMode ? `bg-grayBlack` : `bg-white`
        } text-xs py-2 rounded-md  mt-3`}
      >
        <p>Actions</p>
        <div className="flex justify-normal">
          <p className="pr-16"> Super Admin</p>
          <p className="pr-20">Admin</p>
          <p className="pr-20"> Viewer</p>
        </div>
      </div>
      {/* <------------------------------USER MANAGEMENT-------------------------------> */}
      <div>
        <p className="text-primary py-2 text-sm ">User Management</p>
        <div
          className={`${isDarkMode ? `bg-grayBlack` : `bg-white`} rounded-md  `}
        >
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Add Members</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Delete Members</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Delete Registered Users</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Delete Guest Users</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
        </div>
      </div>
      {/* <-------------------------------TESTIMONY MANAGEMENT PERMISSION-----------------------------------> */}
      <div>
        <p className="text-primary py-2 text-sm ">Testimony Management</p>
        <div
          className={`${isDarkMode ? `bg-grayBlack` : `bg-white`} rounded-md  `}
        >
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Approved Written Testimonies</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Reject Written Testimonies</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Delete Written Testimonies</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Upload Videos Testimonies</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Schedule Videos Testimonies</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Edit Videos Testimonies</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Delete Videos Testimonies</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
        </div>
      </div>
      {/* <----------------------DONATIONS MANAGEMENT PERMISSION-------------------------> */}
      <div>
        <p className="text-primary py-2 text-sm ">Donations Management</p>
        <div
          className={`${isDarkMode ? `bg-grayBlack` : `bg-white`} rounded-md  `}
        >
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Verify Donations</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
        </div>
      </div>
      {/* <--------------------------REVIEWS MANAGEMENT PERMISSIONS------------------------------> */}
      <div>
        <p className="text-primary py-2 text-sm ">Reviews Management</p>
        <div
          className={`${isDarkMode ? `bg-grayBlack` : `bg-white`} rounded-md  `}
        >
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>View Reviews</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Delete Reviews</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
        </div>
      </div>
      {/* <---------------------------------------ADMIN MANAGEMENT PERMISSIONS -------------------------------> */}
      <div>
        <p className="text-primary py-2 text-sm ">Admin Management</p>
        <div
          className={`${isDarkMode ? `bg-grayBlack` : `bg-white`} rounded-md  `}
        >
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Change Members Roles</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Add New Members Roles</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Edit Member Details</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>delete Members</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
          <div className="flex justify-between w-full px-4  text-xs py-2 ">
            <p>Manage Permissions</p>
            <div>
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
              <input className="mr-[100px]" type="checkbox" name="" id="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
