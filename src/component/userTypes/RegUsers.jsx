import React, { useContext, useState } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { regUsers } from "../../data/userdetails";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { SearchOutlined } from "@ant-design/icons";
import { LuChevronsUpDown } from "react-icons/lu";
import UserRegProfile from "../Popups/UserRegProfile";
import useSort from "../../context/useSort";
import usePagination from "../../context/usePagination";

const RegUsers = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [registeredUsers, setRegisteredUsers] = useState(regUsers);
  const [isOpenOptions, setIsOpenOptions] = useState(-1);
  const [searchItem, setSearchItem] = useState("");

  const tableHeaders = [
    {
      key: "serialno",
      Label: "S/N",
    },
    {
      key: "userid",
      Label: "User ID",
    },
    {
      key: "name",
      Label: "Name",
    },
    {
      key: "email",
      Label: "Email",
    },
    {
      key: "regdate",
      Label: "Registration Date",
    },
    {
      key: "lastlogin",
      Label: "Last Login",
    },
  ];
  const toggleOptions = (index) => {
    setIsOpenOptions(isOpenOptions === index ? -1 : index);
  };
  //<--------------------User Profile dtails-------------------->
  const [profile, setProfile] = useState(false);
  const [eachUser, setEachUser] = useState(null);
  const openProfileModal = (id) => {
    const userProfileMatch = registeredUsers.find((user) => user.id === id);
    setIsOpenOptions(false);
    if (userProfileMatch) {
      setEachUser(userProfileMatch);
      setProfile(true);
      console.log(userProfileMatch);
    } else {
      console.error("User not found");
    }
  };
  const { currentPage, setCurrentPage, firstIndex, lastIndex, users, npage } =
    usePagination(registeredUsers);
  const { sort, sortHeader, sortArray } = useSort();
  return (
    <div className="">
      <div
        className={`flex justify-between items-center w-full  rounded-t-xl mt-5 px-4 ${
          isDarkMode ? `dark-mode` : `bg-white `
        }`}
      >
        <h3 className="py-5 text-lg">User Management</h3>
        <div className="flex items-center gap-4">
          {/*---------------------------------------- Search Bar  ---------------------------------*/}
          <div
            className={`flex justify-left items-center gap-2  p-3 rounded-lg w-[300px] ${
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
              placeholder="Search by name, email, userID"
              onChange={(e) => {
                setSearchItem(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      {/* <<----------------------------Profile Modal -------------------------->> */}
      {profile && (
        <UserRegProfile setProfile={setProfile} registeredUsers={eachUser} />
      )}

      {/* --------------------------------Table Details ---------------------------------------- */}
      <div
        className={`table-container ${
          isDarkMode ? `bg-black` : `bg-white `
        }`}
      >
        <table
          className={`custom-table font-sans text-[14px] ${
            isDarkMode ? `dark-mode` : `light-mode`
          } `}
        >
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  className={`cursor-pointer  border-b-2${
                    isDarkMode ? ` border-b-[#333333] ` : ` border-b-off-white`
                  }`}
                  onClick={() => {
                    sortHeader(header);
                  }}
                  key={index}
                >
                  <div className="flex items-center gap-1">
                    {header.Label}
                    <i>
                      <LuChevronsUpDown
                        direction={
                          sort.keyToSort === header.key
                            ? sort.direction
                            : "ascending"
                        }
                      />
                    </i>
                  </div>
                </th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          {sortArray(users)
            .filter((item) => {
              const searchTerm = searchItem.toLowerCase();
              return (
                searchTerm === "" ||
                item.name.toLowerCase().includes(searchTerm) ||
                item.email.toLowerCase().includes(searchTerm) ||
                item.userId.toLowerCase().includes(searchTerm)
              );
            })
            .map((data, index) => (
              <tbody className="relative" key={data.id}>
                <tr
                  className={` ${
                    isDarkMode
                      ? `hover:bg-[#313131]`
                      : `hover:bg-off-white text-black`
                  }`}
                >
                  <td>{data.id}</td>
                  <td>{data.userId}</td>
                  <td>{data.name}</td>
                  <td>{data.email}</td>
                  <td>{data.regDate}</td>
                  <td>{data.lastLogin}</td>
                  <td>
                    {isOpenOptions === data.id && (
                      <div
                        onClick={() => openProfileModal(data.id)}
                        className={`rounded-lg ${
                          isDarkMode
                            ? `text-white bg-[#292929]`
                            : `text-black bg-white`
                        }  w-[120px] border-[1px] border-white absolute top-10 right-10 z-20 shadow-lg`}
                      >
                        <p className="p-2 text-center">View profile</p>
                      </div>
                    )}
                    <i
                      onClick={() => {
                        toggleOptions(data.id);
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

      {/* ----------------------------------------PAgination-------------------------------------------- */}
      <div className="flex justify-between items-center w-full pt-24 pb-12 px-4">
        {registeredUsers.length === 0 ? (
          <p>Showing 0 of 0</p>
        ) : (
          <p>
            Showing {` ${firstIndex + 1} - ${lastIndex}`} of {registeredUsers.length}
          </p>
        )}
        <div className="flex gap-2 items-center">
          <button
            className="px-4 py-2 border-2 border-[#575757] rounded-md hover:border-[#9966CC]"
            onClick={() => {
              currentPage > 1 && setCurrentPage(currentPage - 1);
            }}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 border-2 border-[#9966CC] rounded-md text-[#9966CC]"
            onClick={() => {
              currentPage !== npage && setCurrentPage(currentPage + 1);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegUsers;
