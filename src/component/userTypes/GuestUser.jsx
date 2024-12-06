import React,{useContext} from "react";
import { GuestUsers } from "../../data/userdetails";
import { RiDeleteBin6Line } from "react-icons/ri";
import { UserContext } from "../../context/UserContext";
import { LuChevronsUpDown } from "react-icons/lu";
const GuestUser = () => {
  const {
    handleSelectAll,
    handleUserSelect,
    selectedUsers,
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
                  id="guestCheckbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th><div className="flex items-center gap-1">
                 S/N
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div></th>
              <th><div className="flex items-center gap-1">
                  Guest ID
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div></th>
              <th><div className="flex items-center gap-1">
                  Number of sessions
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div></th>
              <th><div className="flex items-center gap-1">
                  Last Login
                  <i>
                    <LuChevronsUpDown />
                  </i>
                </div></th>
              <th>Actions</th>
            </tr>
          </thead>
          {GuestUsers.map((data) => (
            <tbody key={data.id}>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    name="guest"
                    id="guest-checkbox"
                    checked={selectedUsers.includes(data.id)}
                    onChange={()=>{handleUserSelect(data.id)}}
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
