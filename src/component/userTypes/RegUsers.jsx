import React, { useContext, useState } from "react";
import { userDetails } from "../../data/userdetails";
import { MdOutlineMoreHoriz } from "react-icons/md";

import { DarkModeContext } from "../../context/DarkModeContext";
const Users = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div className="">
      <div
        className={` table-container${
          isDarkMode ? `` : `bg-white`
        } rounded-b-lg`}
      >
        <table
          className={`custom-table ${
            isDarkMode ? `` : `text-black bg-white`
          } font-san text-[14px]`}
        >
          <thead>
            <tr>
              <th>S/N</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Registration Date</th>
              <th>Last Login</th>
              <th>Action</th>
            </tr>
          </thead>
          {userDetails.map((data) => (
            <tbody key={data.id}>
              <tr
                className={`bg-gray-200 ${
                  isDarkMode ? `` : `bg-gray-200 text-black`
                }`}
              >
                <td>{data.id}</td>
                <td>{data.userId}</td>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>{data.regDate}</td>
                <td>{data.lastLogin}</td>
                <td>
                  <MdOutlineMoreHoriz />
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
      
    </div>
  );
};

export default Users;
