import React, { useContext, useState } from "react";
import { regUsers } from "../../data/userdetails";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { SearchOutlined } from "@ant-design/icons";
import { LuChevronsUpDown } from "react-icons/lu";
import { UserProfile } from "../Popups/UserProfile";

const RegUsers = () => {
  const [isOpenOptions, setIsOpenOptions] = useState({});
  const [profile, setProfile] = useState(false);
  const toggleOptions = (index) => {
    setIsOpenOptions((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const openProfileModal=()=>{
    setIsOpenOptions(false)
    setProfile(true);
  }

  //Pagination Function
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 9;
  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const users = regUsers.slice(firstIndex, lastIndex);
  const npage = Math.ceil(regUsers.length / usersPerPage);

  const prevPage = () => {
    if (currentPage !== firstIndex && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const [searchItem, setSearchItem] = useState("");
  console.log(searchItem);
  return (
    <div className="">
      <div className="flex justify-between items-center w-full">
        <h3 className="py-5 text-lg">User Management</h3>
        <div className="flex items-center gap-4">
          <div
            className="flex justify-left items-center gap-2  p-3 rounded-lg w-[300px] bg-[#171717]
            "
          >
            <SearchOutlined style={{ fontSize: "16px" }} />
            <input
              className="border-none outline-none bg-transparent w-[200px] text-xs placeholder:text-xs"
              type="text"
              name="search"
              id="search-user"
              placeholder="Search by name, email, userID"
              onChange={(e) => {
                setSearchItem(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      {profile && <UserProfile setProfile={setProfile} />}
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
          {users
            .filter((item) => {
              return searchItem.toLowerCase() == ""
                ? item
                : item.name.toLowerCase().includes(searchItem);
            })
            .map((data, index) => (
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
                      <div
                        onClick={openProfileModal}
                        className=" rounded-lg  text-white bg-[#292929] w-[120px] border-[1px] border-white absolute top-10 right-10  z-10"
                      >
                        <p className="p-2 text-center">View profile</p>
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
      <div className="flex justify-between items-center w-full pt-24 pb-12 px-4">
        <p>
          Showing {` ${firstIndex + 1} - ${lastIndex}`} of {npage}
        </p>
        <div className="flex gap-2 items-center">
          <button
            className="px-4 py-2 border-2 border-[#575757] rounded-md hover:border-[#9966CC]"
            onClick={prevPage}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 border-2 border-[#9966CC] rounded-md text-[#9966CC]"
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegUsers;
