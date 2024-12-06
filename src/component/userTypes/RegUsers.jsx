import React, { useContext, useState } from "react";
import { userDetails } from "../../data/userdetails";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { LuChevronsUpDown } from "react-icons/lu";

const RegUsers = () => {
  const [isOpenOptions, setIsOpenOptions] = useState({});
  
  const toggleOptions = (index) => {
    setIsOpenOptions(prevState => ({
      ...prevState,
      [index]: !prevState[index] 
    }));
  };
  return (
    <div className="">
      <div className="table-container">
        <table className="custom-table font-san text-[14px]">
          <thead>
            <tr>
              <th>
                <div className="flex items-center gap-1">
                  S/N
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  User ID
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>

              <th>
                <div className="flex items-center gap-1">
                  Name
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  Email
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  Registration Date
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  Last Login
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          {userDetails.map((data,index) => (
            <tbody className="relative" key={data.id}>
              <tr className="bg-gray-200">
                <td>{data.id}</td>
                <td>{data.userId}</td>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>{data.regDate}</td>
                <td>{data.lastLogin}</td>
                <td>
                  {isOpenOptions[index] && (
                    <div className=" rounded-lg  text-white bg-[#292929] w-[120px] border-[1px] border-white absolute top-10 right-10  z-10">
                      <p className="p-2 text-center">
                        View profile
                      </p>
                    </div>
                  )}
                  <i
                    onClick={() => {
                      toggleOptions(index);
                    }}
                  >
                    <MdOutlineMoreHoriz />
                  </i>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export default RegUsers;
