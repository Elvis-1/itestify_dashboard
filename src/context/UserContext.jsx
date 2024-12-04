import React from "react";
import { createContext, useState } from "react";
export const UserContext = createContext();
const UserContextProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleItemSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedItems(selectAll ? [] : items.map((item) => item.id));
  };

  const handleDeleteSelected = () => {
    setItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setSelectAll(false);
  };
  return (
      <UserContext.Provider
        value={{
          handleSelectAll,
          handleItemSelect,
          handleDeleteSelected,
          selectedItems,
          setSelectedItems,
          selectAll
        }}
      >
        {children}
      </UserContext.Provider>
  );
};

export default UserContextProvider;
