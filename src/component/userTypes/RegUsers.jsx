import React, { useContext, useState, useMemo, useEffect } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { SearchOutlined } from "@ant-design/icons";
import { LuChevronsUpDown } from "react-icons/lu";
import UserRegProfile from "../Popups/UserRegProfile";
import useSort from "../../hooks/useSort";
import usePagination from "../../hooks/usePagination";
import Pagination from "../Pagination";
import NoDataComponent from "../NoDataComponent";
import LoadingState from "../LoadingState.jsx";

const RegUsers = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isOpenOptions, setIsOpenOptions] = useState(-1);
  const [searchItem, setSearchItem] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  const regUsersIndex = useMemo(() => {
    const searchTerm = searchItem.toLowerCase().trim();
    return registeredUsers.filter(
      (item) =>
        searchTerm === "" ||
        item.full_name?.toLowerCase().includes(searchTerm) ||
        item.email?.toLowerCase().includes(searchTerm) ||
        item.id?.toLowerCase().includes(searchTerm)
    );
  }, [searchItem, registeredUsers]);
  const { sort, sortHeader, sortedData } = useSort(regUsersIndex);
  const { currentPage, setCurrentPage, firstIndex, lastIndex, users, npage } =
    usePagination(sortedData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://itestify-backend-nxel.onrender.com/users/registered/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc2NTI5NjAxLCJpYXQiOjE3NDQ5OTM2MDEsImp0aSI6IjQxOWRhZGI3MTQyYzQ3MjRhZWExYjIxMjZmYWM3N2RjIiwidXNlcl9pZCI6IjM0YjM0NTU3LTU4YmMtNDllYi04M2Q3LTE1MzM0YWM3YWI0OSJ9.Z9WEhCFG2VaKCt8REzD8cjGHhEaHfZWCYHA2a_3Sk4M",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setRegisteredUsers(data.data);
        setIsLoading(false);
        console.log(data);
      } catch (error) {
        console.error("Error fetching deleted users:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative">
      {isLoading && <LoadingState />}
      {/* <<----------------------------Profile Modal -------------------------->> */}
      {profile && (
        <UserRegProfile setProfile={setProfile} registeredUsers={eachUser} />
      )}
      <div
        className={`flex justify-between items-center w-full mt-5 px-4 rounded-t-2xl ${
          isDarkMode ? `bg-lightBlack dark-mode` : `bg-white `
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

      {/* --------------------------------Table Details ---------------------------------------- */}
      <div
        className={`h-[21rem] rounded-b-2xl overflow-hidden  ${
          isDarkMode ? `bg-lightBlack` : `bg-white `
        }`}
      >
        <table
          className={`custom-table  font-sans text-[14px] ${
            isDarkMode ? `bg-lightBlack dark-mode` : `light-mode`
          } `}
        >
          <thead
            className={` text-xs ${
              isDarkMode ? `bg-near-black` : `bg-off-white text-black`
            }`}
          >
            <tr
              className={` ${
                isDarkMode
                  ? `bg-off-black text-white hover:bg-[#313131]`
                  : `bg-white text-black hover:bg-off-white`
              }`}
            >
              {tableHeaders.map((header, index) => (
                <th
                  className={`cursor-pointer ${
                    isDarkMode
                      ? `bg-off-black text-white`
                      : `bg-off-white text-black`
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
              <th
                className={`cursor-pointer ${
                  isDarkMode
                    ? `bg-off-black text-white`
                    : `bg-off-white text-black`
                }`}
              >
                Action
              </th>
            </tr>
          </thead>
          {regUsersIndex.length > 0 ? (
            users.map((data, index) => (
              <tbody className="relative" key={data.id}>
                <tr
                  className={` ${
                    isDarkMode
                      ? `hover:bg-[#313131]`
                      : `hover:bg-off-white text-black`
                  }`}
                >
                  <td>{firstIndex + index + 1}</td>
                  <td>{data.id.slice(0, 6)}</td>
                  <td>{data.full_name}</td>
                  <td>{data.email}</td>
                  <td>{new Date(data.created_at).toLocaleDateString()}</td>
                  <td>{new Date(data.last_login).toLocaleDateString()}</td>
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
            ))
          ) : (
            <tbody>
              <tr className="border-b-0">
                <td
                  colSpan={8}
                  className="hover:bg-transparent border-b-0 border-b-transparent"
                >
                  <NoDataComponent />
                </td>
              </tr>
            </tbody>
          )}
        </table>
        {/* ----------------------------------------PAgination-------------------------------------------- */}
        <Pagination
          data={regUsersIndex}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          firstIndex={firstIndex}
          lastIndex={lastIndex}
          npage={npage}
        />
      </div>
    </div>
  );
};

export default RegUsers;
