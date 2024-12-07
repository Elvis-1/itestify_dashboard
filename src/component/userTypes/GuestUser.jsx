import React, { useState } from "react";
import { GuestUsers } from "../../data/userdetails";
import DeleteModal from "../Popups/DeleteGuestModal";
import { RiDeleteBin6Line } from "react-icons/ri";

const GuestUser = () => {
  const [users, setUsers] = useState(GuestUsers);
  const [deleteGuestModal, setDeleteGuestModal] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 9;
  const lastIndex = currentPage * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const usersIndex = users.slice(firstIndex, lastIndex);
  const npage = Math.ceil(users.length / usersPerPage);

  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const allUserIds = users.map((user) => user.id);
    setSelectAll(!selectAll);
    setSelectedUsers(!selectAll ? allUserIds : []);
  };

  const openSelectedDeleteModal = () => {
    if (selectedUsers.length > 0) {
      setDeleteGuestModal(true);
    }
  };
  const openDeleteModal = () => {
    setDeleteGuestModal(true);
  };

  const handleDeleteSelected = () => {
    setUsers((prev) => {
      const newUserList = prev.filter(
        (user) => !selectedUsers.includes(user.id)
      );
      return newUserList;
    });
    setSelectedUsers([]);
    setDeleteGuestModal(false);
    setSelectAll(false);
    setSuccessDelete(true);
  };

  return (
    <div>
      {deleteGuestModal && (
        <DeleteModal
          onConfirm={handleDeleteSelected}
          onCancel={() => setDeleteGuestModal(false)}
          selectedUsers={selectedUsers}
        />
      )}
      {successDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-black ">
          <div>
            <p className=" text-2xl font-bold rounded-lg bg-black text-center p-32">Delete Successful!</p>
          </div>{" "}
        </div>
      )}
      <div className="flex justify-between items-center w-full">
        <h3 className="py-5 text-lg">User Management</h3>
        <div className="flex items-center gap-4">
          {(selectAll || selectedUsers.length > 0) && (
            <div
              onClick={openSelectedDeleteModal}
              className="flex items-center justify-normal gap-1 p-2 bg-[#E53935] rounded-md cursor-pointer hover:bg-[#E23920]"
            >
              <RiDeleteBin6Line />
              <p className="text-xs">Delete</p>
            </div>
          )}
        </div>
      </div>
      {users.length === 0 ? (
        <div className="text-center font-bold text-xl">No data here </div>
      ) : (
        <div className="table-container">
          <table className="custom-table font-san text-[14px]">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>S/N</th>
                <th>Guest ID</th>
                <th>Number of Sessions</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersIndex.map((data) => (
                <tr key={data.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(data.id)}
                      onChange={() => handleUserSelect(data.id)}
                    />
                  </td>
                  <td>{data.id}</td>
                  <td>{data.guestId}</td>
                  <td>{data.numOfSessions}</td>
                  <td>{data.lastLogin}</td>
                  <td onClick={openDeleteModal}>
                    <RiDeleteBin6Line fill="#E53935" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center w-full pt-24 pb-12 px-4">
        <p>
          Showing {`${firstIndex + 1} - ${lastIndex}`} of {users.length}
        </p>
        <div className="flex gap-2 items-center">
          <button
            className="px-4 py-2 border-2 border-[#575757] rounded-md hover:border-[#9966CC]"
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 border-2 border-[#9966CC] rounded-md text-[#9966CC]"
            onClick={() =>
              currentPage < npage && setCurrentPage(currentPage + 1)
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestUser;
