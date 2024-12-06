import React from "react";
import { createContext, useState } from "react";
export const UserContext = createContext();
const UserContextProvider = ({ children }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [users, setUsers] = useState([]);
  const handleUserSelect = (UserId) => {
    setSelectedUsers((prev) =>
      prev.includes(UserId)
        ? prev.filter((id) => id !== UserId)
        : [...prev, UserId]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedUsers(selectAll ? [] : users.map((user) => user.id));
  };

  const handleDeleteSelected = () => {
    setUsers((prev) => prev.filter((User) => !selectedUsers.includes(User.id)));
    // setSelectedUsers([]);
    setDeleteModal(true);
  };
  return (
    <UserContext.Provider
      value={{
        handleSelectAll,
        handleUserSelect,
        handleDeleteSelected,
        selectedUsers,
        setSelectedUsers,
        selectAll,
        deleteModal,
        setDeleteModal,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
