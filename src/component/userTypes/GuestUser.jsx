import React,{useContext} from "react";
import { GuestUsers } from "../../data/userdetails";
import { RiDeleteBin6Line } from "react-icons/ri";
import { UserContext } from "../../context/UserContext";

const GuestUser = () => {
  const {
    handleSelectAll,
    handleItemSelect,
    selectedItems,
    selectAll,
    handleDeleteSelected,
  } = useContext(UserContext);
  return (
    <div>
      <div className="table-container">
        <table className="custom-table font-san text-[14px]">
          <thead>
            <tr>
              <th>
                <input
                  className=""
                  type="checkbox"
                  name="guest"
                  id="guest-checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>S/N</th>
              <th>Guest ID</th>
              <th>Number of sessions</th>
              <th>Last login</th>
              <th>Actions</th>
            </tr>
          </thead>
          {GuestUsers.map((data) => (
            <tbody>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    name="guest"
                    id="guest-checkbox"
                    checked={selectedItems.includes(data.id)}
                    onChange={handleItemSelect(data.id)}
                  />
                </td>
                <td>{data.id}</td>
                <td>{data.guestId}</td>
                <td>{data.numOfSessions}</td>
                <td>{data.lastLogin}</td>
                <td
                  onClick={() => {
                    handleDeleteSelected(data.id);
                  }}
                >
                  <RiDeleteBin6Line fill="#E53935" />
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export default GuestUser;
