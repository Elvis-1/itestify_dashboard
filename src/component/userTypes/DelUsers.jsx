import React, { useContext, useState } from "react";
import { DeletedUsers } from "../../data/userdetails";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { LuChevronsUpDown } from "react-icons/lu";
import DeleteModal from "../Popups/DeleteGuestModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";

const DelUsers = () => {
  const [isOpenOptions, setIsOpenOptions] = useState({});
  const toggleOptions = (index) => {
    setIsOpenOptions((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  //Pagination Function
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 9;
  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const delUsersIndex = DeletedUsers.slice(firstIndex, lastIndex);
  const npage = Math.ceil(DeletedUsers.length / usersPerPage);

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

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  // User Selection State

  // Handle Individual User Selection
  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle Select All Users
  const handleSelectAll = () => {
    const allUserIds = DeletedUsers.map((user) => user.id);
    setSelectAll(!selectAll);
    setSelectedUsers(!selectAll ? allUserIds : []);
  };

  // Open Delete Modal
  const openDeleteModal = () => {
    setDeleteModal(true);
  };

  // // Handle Deleting Selected Users
  // const handleDeleteSelected = (id) => {
  //   setUsers((prev) => prev.filter((User) => !selectedUsers.includes(User.id)));
  //   setSelectedUsers([]);
  //   setDeleteModal(true);
  //   const newArray = selectedUsers.filter((items) => items.id !== id);
  //   setSelectedUsers(newArray);
  //   console.log(id);
  // };

  const [searchItem, setSearchItem] = useState("");
  return (
    <div>
      {/* {deleteModal && (
        <DeleteModal
          handleDeleteSelected={handleDeleteSelected}
          selectAll={selectAll}
        />
      )} */}
      <div className="flex justify-between items-center w-full">
        <h3 className="py-5 text-lg">User Management</h3>
        <div className="flex items-center gap-4">
          {(selectAll || selectedUsers.length > 0) && (
            <div
              // onClick={openDeleteModal}
              className="flex items-center justify-normal gap-1 p-2 bg-[#E53935] rounded-md cursor-pointer hover:bg-[#E23920]"
            >
              <RiDeleteBin6Line />
              <p className="text-xs">Delete</p>
            </div>
          )}
          <div className="flex justify-left items-center gap-2 p-3 rounded-lg w-[300px] bg-[#171717]">
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
      <div className="table-container">
        <table className="custom-table font-san text-[14px]">
          <thead>
            <tr>
              <th>
                <input
                  className=""
                  type="checkbox"
                  name="deletedUser"
                  id="delUser-checkbox"
                  onChange={handleSelectAll}
                  checked={selectAll}
                />
              </th>
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
                  Deletion date
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>
              <th>
                <div className="flex items-center gap-1">
                  Reason
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          {delUsersIndex
            .filter((item) => {
              return searchItem.toLowerCase() == ""
                ? item
                : item.name.toLowerCase().includes(searchItem);
            })
            .map((data, index) => (
              <tbody className="relative" key={data.id}>
                <tr>
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
                  <td>{data.id}</td>
                  <td>{data.userId}</td>
                  <td>{data.name}</td>
                  <td>{data.email}</td>
                  <td>{data.deletionDate}</td>
                  <td>{data.reason}</td>
                  <td>
                    {isOpenOptions[index] && (
                      <div className=" rounded-lg  text-white bg-[#292929] w-[120px] border-[1px] border-white absolute top-10 right-10  z-10">
                        <p className="border-b-[1px] border-gray-300 p-2">
                          View profile
                        </p>
                        <p className="p-2 text-[#E53935]">Delete</p>
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

export default DelUsers;
