import React, { useContext, useMemo, useState, useEffect } from "react";
import { DarkModeContext } from "../../context/DarkModeContext.jsx";
import { DeletedUsers } from "../../data/userdetails";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { LuChevronsUpDown } from "react-icons/lu";
import DeleteRecordsModal from "../Popups/DeleteRecordsModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import UserDelProfile from "../Popups/UserDelProfile.jsx";
import useSort from "../../hooks/useSort.jsx";
import usePagination from "../../hooks/usePagination.jsx";
import Pagination from "../Pagination.jsx";
import SuccessModal from "../Popups/SuccessModal.jsx";
import NoDataComponent from "../NoDataComponent.jsx";
import LoadingState from "../LoadingState.jsx";

const DelUsers = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [isOpenOptions, setIsOpenOptions] = useState(-1);
  const [deleteRecordModal, setDeleteRecordModal] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
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
      key: "deldate",
      Label: "Deleteion Date",
    },
    {
      key: "reason",
      Label: "Reason",
    },
  ];
  const toggleOptions = (index) => {
    setIsOpenOptions(isOpenOptions === index ? -1 : index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://itestify-backend-nxel.onrender.com/users/deleted/",
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
        setDeletedUsers(data.data);
        setIsLoading(false);
        console.log(data);
      } catch (error) {
        console.error("Error fetching deleted users:", error);
      }
    };

    fetchData();
  }, []);

  const delUsersIndex = useMemo(() => {
    const searchTerm = searchItem.toLowerCase().trim();
    return deletedUsers.filter(
      (item) =>
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm) ||
        item.userId.toLowerCase().includes(searchTerm)
    );
  }, [searchItem, DeletedUsers]);
  //<--------------------User Profile dtails-------------------->
  const [profile, setProfile] = useState(false);
  const [eachUser, setEachUser] = useState(null);
  const openProfileModal = (id) => {
    const userProfileMatch = delUsersIndex.find((user) => user.id === id);
    setIsOpenOptions(false);
    if (userProfileMatch) {
      setEachUser(userProfileMatch);
      setProfile(true);
      console.log(userProfileMatch);
    } else {
      console.error("User not found");
      return <div>User not found!</div>;
    }
  };
  // User Selection State
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Handle Individual User Selection
  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle Select All Records
  const handleSelectAll = () => {
    const allUserIds = delUsersIndex.map((user) => user.id);
    setSelectAll(!selectAll);
    setSelectedUsers(!selectAll ? allUserIds : []);
  };

  const handleDeleteSelected = async () => {
    try {
      // Ensure selectedUsers is not empty
      if (selectedUsers.length === 0) {
        setError("No users selected for deletion");
        return;
      }
  
      // Send DELETE requests for each selected user
      const deletePromises = selectedUsers.map(async (userId) => {
        const response = await fetch(`https://itestify-backend-nxel.onrender.com/users/${userId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errText}`);
        }
        // Handle 204 No Content
        if (response.status !== 204) {
          return response.json();
        }
        return null;
      });
  
      // Wait for all DELETE requests to complete
      await Promise.all(deletePromises);
      console.log("Selected users deleted successfully");
  
      // Update state
      setDeletedUsers((prev) =>
        prev.filter((user) => !selectedUsers.includes(user.id))
      );
      setSelectedUsers([]);
      setSelectAll(false);
      setDeleteRecordModal(false);
      setIsSuccessModal(true);
    } catch (error) {
      console.error("Error deleting users:", error.message);
      setError(error.message);
    }
  };
  //Handle Delete Individually
  const handleDeleteById = async (userId) => {
    try {
      const response = await fetch(
        `https://itestify-backend-nxel.onrender.com/users/${userId}/`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        alert("Error deleting user:", response.statusText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("User deleted successfully:", data);
      setDeletedUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    setIsOpenOptions(-1);
    setIsSuccessModal(true);
  };

  useEffect(() => {
    if (isSuccessModal) {
      const timeout = setTimeout(() => {
        setIsSuccessModal(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isSuccessModal]);

  const { sort, sortHeader, sortedData } = useSort(delUsersIndex);
  const { currentPage, setCurrentPage, firstIndex, lastIndex, users, npage } =
    usePagination(sortedData);

  // const API_URL = "/auth/get_users";

  return (
    <div className="relative">
      {isLoading && <LoadingState />}
      {/* <---------------delete modal----------------> */}
      {deleteRecordModal && (
        <DeleteRecordsModal
          onConfirm={handleDeleteSelected}
          onCancel={() => setDeleteRecordModal(false)}
          selectAll={selectAll}
          isSuccessModal={isSuccessModal}
          setIsSuccessModal={setIsSuccessModal}
        />
      )}
      {isSuccessModal && <SuccessModal sucessMessage="Deleted Successfully!" />}
      <div
        className={`flex justify-between items-center bg-lightBlack  rounded-t-xl mt-5 px-4 ${
          isDarkMode ? `bg-lightBlack dark-mode` : `bg-white `
        }`}
      >
        <h3 className="py-5 text-lg">User Management</h3>
        {/* <-------------------------------------------------Delete Button--------------------------------------------> */}
        <div className="flex items-center gap-4 ">
          {(selectAll || selectedUsers.length > 0) && (
            <div
              onClick={() => {
                setDeleteRecordModal(true);
              }}
              className="flex items-center justify-normal gap-1 p-2 py-3 bg-[#E53935] rounded-md cursor-pointer hover:bg-[#E23920]"
            >
              <RiDeleteBin6Line fill="white" />
              <p className="text-xs text-white ">
                {selectAll ? ` Delete All` : `Delete`}
              </p>
            </div>
          )}
          {/* <---------------------------------------------Search Input-------------------------------------------> */}
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
      {profile && (
        <UserDelProfile setProfile={setProfile} deletedUsers={eachUser} />
      )}
      {/* <----------------------------------Table Data---------------------------------------------> */}

      <div
        className={` rounded-b-2xl h-[21rem]  ${
          isDarkMode ? `bg-lightBlack` : `bg-white`
        }`}
      >
        <table
          className={`custom-table  opacity-70 font-san text-[14px]   ${
            isDarkMode ? `bg-lightBlack dark-mode ` : `light-mode`
          } `}
        >
          <thead
            className={` text-xs  ${
              isDarkMode ? `bg-near-black` : `bg-off-white text-black`
            }`}
          >
            <tr>
              <th
                className={`cursor-pointer ${
                  isDarkMode
                    ? `bg-off-black text-white`
                    : `bg-off-white text-black`
                }`}
              >
                <input
                  className=""
                  type="checkbox"
                  name="deletedUser"
                  id="delUser-checkbox"
                  onChange={handleSelectAll}
                  checked={selectAll}
                />
              </th>
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
                  <div className="flex items-center gap-1 ">
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
          {delUsersIndex.length > 0 ? (
            users.map((data, index) => (
              <tbody className="relative" key={data.id}>
                <tr
                  className={` ${
                    isDarkMode
                      ? `bg-lightBlack text-white hover:bg-[#313131]`
                      : `bg-white text-black hover:bg-off-white`
                  }`}
                >
                  <td>
                    <input
                      type="checkbox"
                      name="deletedUser"
                      id="delUser-checkbox"
                      onChange={() => {
                        handleUserSelect(data.id);
                      }}
                      checked={selectedUsers.includes(data.id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{data.id.slice(0, 6)}</td>
                  <td>{data.full_name}</td>
                  <td>{data.email}</td>
                  <td>{new Date(data.updated_at).toLocaleDateString()}</td>
                  <td>{data.reason}</td>
                  <td className="">
                    <i
                      onClick={() => {
                        toggleOptions(data.id);
                      }}
                    >
                      <MdOutlineMoreHoriz />
                    </i>
                    {/* <----------------------------------Option dropdown-----------------------------------------> */}
                    {isOpenOptions === data.id && (
                      <div
                        className={`rounded-lg ${
                          isDarkMode
                            ? `text-white bg-[#292929]`
                            : `text-black bg-white`
                        } w-[120px]  border-[1px] border-white h-fit absolute top-10 right-10 z-[99999] shadow-lg`}
                      >
                        <p
                          onClick={() => {
                            openProfileModal(data.id);
                          }}
                          className="border-b-[1px] border-gray-300 p-2 cursor-pointer"
                        >
                          View profile
                        </p>
                        <p
                          onClick={() => {
                            handleDeleteById(data.id);
                          }}
                          className="p-2 text-[#E53935] cursor-pointer"
                        >
                          Delete
                        </p>
                      </div>
                    )}
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
      </div>
      {/* <---------------------------------------------Pagination --------------------------------------------> */}
      <Pagination
        data={delUsersIndex}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        firstIndex={firstIndex}
        lastIndex={lastIndex}
        npage={npage}
      />
    </div>
  );
};

export default DelUsers;
